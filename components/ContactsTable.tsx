'use client'

import { useState } from 'react';
import { revealContactDetails } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  title: string | null;
  agency: {
    name: string;
  } | null;
  isRevealed?: boolean;
}

interface ContactRowProps {
  contact: Contact;
  onReveal?: (newCount: number) => void;
  onLimitReached?: () => void;
}

export default function ContactRow({ contact, onReveal, onLimitReached }: ContactRowProps) {
  const [details, setDetails] = useState({ 
    email: contact.isRevealed ? (contact.email || 'N/A') : '****', 
    phone: contact.isRevealed ? (contact.phone || 'N/A') : '****' 
  });
  const [loading, setLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(contact.isRevealed || false);

  const handleReveal = async () => {
    setLoading(true);
    try {
      const result = await revealContactDetails(contact.id);
      
      if (result.error === 'LIMIT_REACHED') {
        if (onLimitReached) {
          onLimitReached();
        } else {
          toast.error("🚨 Daily limit reached! Upgrade to Pro to see more contacts.");
        }
      } else if (result.data) {
        setDetails({
          email: result.data.email || 'N/A',
          phone: result.data.phone || 'N/A'
        });
        setIsRevealed(true);
        toast.success("Contact revealed successfully");
        
        // Mettre à jour le compteur si fourni
        if (result.count !== undefined && onReveal) {
          onReveal(result.count);
        }
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableRow>
      <TableCell className="text-gray-900 dark:text-gray-100">{contact.firstName || ''} {contact.lastName || ''}</TableCell>
      <TableCell className="text-gray-700 dark:text-gray-300">{contact.agency?.name || 'N/A'}</TableCell>
      <TableCell className="font-mono text-sm text-gray-900 dark:text-gray-100">{details.email}</TableCell>
      <TableCell className="font-mono text-sm text-gray-900 dark:text-gray-100">{details.phone}</TableCell>
      <TableCell>
        {!isRevealed && details.email === '****' ? (
          <Button 
            onClick={handleReveal} 
            disabled={loading} 
            size="sm"
            className="cursor-pointer"
            variant="outline"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                View
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Visible</span>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

