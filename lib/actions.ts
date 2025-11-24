'use server'

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { isSameDay } from "date-fns";

export async function getContacts(page = 1) {
  const { userId } = await auth();
  if (!userId) return [];
  
  // Récupère une liste paginée de contacts (infos publiques seulement)
  const contacts = await prisma.contact.findMany({
    take: 20,
    skip: (page - 1) * 20,
    include: { agency: true },
    orderBy: { createdAt: 'desc' }
  });
  
  // Vérifier quels contacts ont déjà été révélés
  const contactIds = contacts.map(c => c.id);
  const revealedContacts = await prisma.contactReveal.findMany({
    where: {
      userId,
      contactId: { in: contactIds }
    },
    select: { contactId: true }
  });
  const revealedIds = new Set(revealedContacts.map(r => r.contactId));
  
  // Récupérer les détails des contacts déjà révélés
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
  
  const detailsMap = new Map(revealedDetails.map(d => [d.id, { email: d.email, phone: d.phone }]));
  
  return contacts.map(c => {
    const isRevealed = revealedIds.has(c.id);
    const details = detailsMap.get(c.id);
    
    return {
      ...c,
      email: isRevealed && details ? (details.email || 'N/A') : '****',
      phone: isRevealed && details ? (details.phone || 'N/A') : '****',
      isRevealed
    };
  });
}

export async function revealContactDetails(contactId: string) {
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
  if (!isSameDay(new Date(userUsage.lastViewDate), now)) {
    // Reset du compteur
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
}

export async function getAgencies(page = 1) {
  const agencies = await prisma.agency.findMany({
    take: 20,
    skip: (page - 1) * 20,
    include: {
      _count: {
        select: { contacts: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return agencies;
}

export async function getUserUsage() {
  const { userId } = await auth();
  if (!userId) return null;
  
  const userUsage = await prisma.userLimit.findUnique({
    where: { userId }
  });
  
  if (!userUsage) {
    return { count: 0, lastViewDate: new Date() };
  }
  
  const now = new Date();
  if (!isSameDay(new Date(userUsage.lastViewDate), now)) {
    return { count: 0, lastViewDate: now };
  }
  
  return {
    count: userUsage.count,
    lastViewDate: userUsage.lastViewDate
  };
}

