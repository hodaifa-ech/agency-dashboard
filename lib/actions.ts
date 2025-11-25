'use server'

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { isSameDay } from "date-fns";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Helper function to check if error is a database connection error
function isDatabaseConnectionError(error: unknown): boolean {
  if (error instanceof PrismaClientKnownRequestError) {
    return error.code === 'P1001' || error.code === 'P1000' || error.code === 'P1017';
  }
  return false;
}

export async function getContacts(
  page = 1,
  pageSize = 20,
  search = '',
  agencyId?: string
) {
  try {
    const { userId } = await auth();
    if (!userId) return { contacts: [], total: 0, totalPages: 0 };
    
    // Build where clause for filtering
    const where: any = {};
    
    // Search filter (search in firstName, lastName, email)
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Agency filter
    if (agencyId) {
      where.agencyId = agencyId;
    }
    
    // Try to fetch contacts first (this often works even when count fails)
    let contacts: any[] = [];
    try {
      contacts = await prisma.contact.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        include: { agency: true },
        orderBy: { createdAt: 'desc' }
      });
    } catch (fetchError) {
      console.error('Error fetching contacts:', fetchError);
      if (isDatabaseConnectionError(fetchError)) {
        console.error('Database connection error - returning empty results');
      }
      return { contacts: [], total: 0, totalPages: 0 };
    }
    
    // Try to get total count (try this after fetching contacts in case connection is intermittent)
    let total = 0;
    let totalPages = 0;
    try {
      total = await prisma.contact.count({ where });
      totalPages = Math.ceil(total / pageSize);
    } catch (countError) {
      console.error('Error counting contacts, estimating from fetched data:', countError);
      // If count fails but we have contacts, estimate total
      if (contacts.length > 0) {
        // If we got a full page, there are likely more contacts
        if (contacts.length === pageSize) {
          // Estimate: at least what we've seen so far, probably more
          total = Math.max((page - 1) * pageSize + contacts.length, contacts.length * 2);
        } else {
          // Partial page, so this is likely close to the total
          total = (page - 1) * pageSize + contacts.length;
        }
        totalPages = Math.ceil(total / pageSize);
      } else {
        // No contacts fetched and count failed
        total = 0;
        totalPages = 0;
      }
    }
    
    // If we have no contacts, return early
    if (contacts.length === 0) {
      return { contacts: [], total: 0, totalPages: 0 };
    }
    
    // Vérifier quels contacts ont déjà été révélés
    const contactIds = contacts.map(c => c.id);
    let revealedIds = new Set<string>();
    let detailsMap = new Map();
    
    try {
      const revealedContacts = await prisma.contactReveal.findMany({
        where: {
          userId,
          contactId: { in: contactIds }
        },
        select: { contactId: true }
      });
      revealedIds = new Set(revealedContacts.map(r => r.contactId));
      
      // Récupérer les détails des contacts déjà révélés
      if (revealedIds.size > 0) {
        const revealedDetails = await prisma.contact.findMany({
          where: {
            id: { in: Array.from(revealedIds) }
          },
          select: {
            id: true,
            email: true,
            phone: true
          }
        });
        detailsMap = new Map(revealedDetails.map(d => [d.id, { email: d.email, phone: d.phone }]));
      }
    } catch (revealError) {
      console.error('Error fetching revealed contacts (non-critical):', revealError);
      // Continue even if revealed contacts query fails
    }
    
    const mappedContacts = contacts.map(c => {
      const isRevealed = revealedIds.has(c.id);
      const details = detailsMap.get(c.id);
      
      return {
        ...c,
        email: isRevealed && details ? (details.email || 'N/A') : '****',
        phone: isRevealed && details ? (details.phone || 'N/A') : '****',
        isRevealed
      };
    });
    
    return {
      contacts: mappedContacts,
      total,
      totalPages
    };
  } catch (error) {
    console.error('Error in getContacts:', error);
    if (isDatabaseConnectionError(error)) {
      console.error('Database connection error - returning empty results');
    }
    return { contacts: [], total: 0, totalPages: 0 };
  }
}

export async function revealContactDetails(contactId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    
    // Vérifier si déjà révélé
    const alreadyRevealed = await prisma.contactReveal.findUnique({
      where: {
        userId_contactId: {
          userId,
          contactId
        }
      }
    });
    
    if (alreadyRevealed) {
      // Déjà révélé, retourner les données sans incrémenter
      const contact = await prisma.contact.findUnique({
        where: { id: contactId },
        select: { email: true, phone: true }
      });
      
      const usage = await getUserUsage();
      return { 
        data: contact,
        count: usage?.count || 0,
        alreadyRevealed: true
      };
    }
    
    // 1. Récupérer ou créer l'entrée de limite utilisateur
    let userUsage = await prisma.userLimit.findUnique({
      where: { userId }
    });
    
    if (!userUsage) {
      userUsage = await prisma.userLimit.create({
        data: { userId }
      });
    }
    
    // 2. Vérifier si c'est un nouveau jour
    const now = new Date();
    const lastViewDate = new Date(userUsage.lastViewDate);
    
    // Check if it's a different day (compare year, month, and day)
    if (
      lastViewDate.getFullYear() !== now.getFullYear() ||
      lastViewDate.getMonth() !== now.getMonth() ||
      lastViewDate.getDate() !== now.getDate()
    ) {
      // Reset du compteur seulement si c'est vraiment un nouveau jour
      userUsage = await prisma.userLimit.update({
        where: { userId },
        data: { count: 0, lastViewDate: now }
      });
    }
    
    // 3. Vérifier la limite
    if (userUsage.count >= 50) {
      return { error: "LIMIT_REACHED" };
    }
    
    // 4. Incrémenter et récupérer les données
    const updatedUsage = await prisma.userLimit.update({
      where: { userId },
      data: { count: { increment: 1 } }
    });
    
    // 5. Persister la révélation
    await prisma.contactReveal.upsert({
      where: {
        userId_contactId: {
          userId,
          contactId
        }
      },
      update: {},
      create: {
        userId,
        contactId
      }
    });
    
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      select: { email: true, phone: true }
    });
    
    return { 
      data: contact,
      count: updatedUsage.count
    };
  } catch (error) {
    console.error('Error in revealContactDetails:', error);
    if (isDatabaseConnectionError(error)) {
      return { error: "DATABASE_ERROR", message: "Unable to connect to database" };
    }
    return { error: "UNKNOWN_ERROR", message: "An error occurred" };
  }
}

export async function getAgencies(page = 1, pageSize = 20) {
  try {
    // Get total count for pagination
    const total = await prisma.agency.count();
    const totalPages = Math.ceil(total / pageSize);
    
    const agencies = await prisma.agency.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        _count: {
          select: { contacts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return {
      agencies,
      total,
      totalPages
    };
  } catch (error) {
    console.error('Error in getAgencies:', error);
    if (isDatabaseConnectionError(error)) {
      console.error('Database connection error - returning empty results');
    }
    return {
      agencies: [],
      total: 0,
      totalPages: 0
    };
  }
}

export async function getAllAgencies() {
  try {
    const agencies = await prisma.agency.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: { name: 'asc' }
    });
    
    return agencies;
  } catch (error) {
    console.error('Error in getAllAgencies:', error);
    if (isDatabaseConnectionError(error)) {
      console.error('Database connection error - returning empty array');
    }
    return [];
  }
}

export async function getUserUsage() {
  try {
    const { userId } = await auth();
    if (!userId) return null;
    
    const userUsage = await prisma.userLimit.findUnique({
      where: { userId }
    });
    
    if (!userUsage) {
      return { count: 0, lastViewDate: new Date() };
    }
    
    const now = new Date();
    const lastViewDate = new Date(userUsage.lastViewDate);
    
    // Check if it's a different day (compare year, month, and day)
    if (
      lastViewDate.getFullYear() !== now.getFullYear() ||
      lastViewDate.getMonth() !== now.getMonth() ||
      lastViewDate.getDate() !== now.getDate()
    ) {
      // Only return 0 if it's actually a new day
      return { count: 0, lastViewDate: now };
    }
    
    return {
      count: userUsage.count,
      lastViewDate: userUsage.lastViewDate
    };
  } catch (error) {
    console.error('Error in getUserUsage:', error);
    if (isDatabaseConnectionError(error)) {
      console.error('Database connection error - returning default usage');
    }
    return { count: 0, lastViewDate: new Date() };
  }
}

