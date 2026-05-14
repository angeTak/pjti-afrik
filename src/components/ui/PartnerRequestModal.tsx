import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PartnerRequestModalProps {
  children?: React.ReactNode;
}

const PartnerRequestModal: React.FC<PartnerRequestModalProps> = ({ children }) => {
  const { addPartnershipRequest } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organization_name: '',
    sector: '',
    custom_sector: '',
    email: '',
    phone: '',
    partnership_type: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalData = {
        organization_name: formData.organization_name,
        sector: formData.sector === 'autre' ? formData.custom_sector : formData.sector,
        email: formData.email,
        phone: formData.phone,
        partnership_type: formData.partnership_type,
        message: formData.message
      };
      await addPartnershipRequest(finalData);
      toast.success('Votre demande de partenariat a été envoyée avec succès. Nous vous contacterons très bientôt.');
      setIsOpen(false);
      setFormData({
        organization_name: '',
        sector: '',
        custom_sector: '',
        email: '',
        phone: '',
        partnership_type: '',
        message: ''
      });
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            className="inline-flex items-center gap-3 px-8 py-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-xl"
          >
            <Mail className="w-5 h-5" />
            Nous écrire pour un partenariat
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-slate-900">Demande de Partenariat</DialogTitle>
          <DialogDescription className="text-slate-500">
            Remplissez ce formulaire pour nous faire part de votre proposition. Notre équipe vous recontactera dans les plus brefs délais.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="organization_name">Nom de l'organisation *</Label>
              <Input
                id="organization_name"
                name="organization_name"
                placeholder="Ex: Fondation Tech pour Tous"
                value={formData.organization_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnership_type">Type de collaboration souhaité *</Label>
              <Select onValueChange={(val) => handleSelectChange('partnership_type', val)} value={formData.partnership_type} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partenaire">Partenaire</SelectItem>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="marraine">Marraine</SelectItem>
                  <SelectItem value="parrain">Parrain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="sector">Votre secteur d'activité *</Label>
              <Select onValueChange={(val) => handleSelectChange('sector', val)} value={formData.sector} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technologie / Informatique">Technologie / Informatique</SelectItem>
                  <SelectItem value="Éducation / Formation">Éducation / Formation</SelectItem>
                  <SelectItem value="Finance / Banque">Finance / Banque</SelectItem>
                  <SelectItem value="Commerce / Vente">Commerce / Vente</SelectItem>
                  <SelectItem value="Santé">Santé</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Média / Communication">Média / Communication</SelectItem>
                  <SelectItem value="Institution publique">Institution publique</SelectItem>
                  <SelectItem value="ONG / Humanitaire">ONG / Humanitaire</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.sector === 'autre' && (
              <div className="space-y-2">
                <Label htmlFor="custom_sector">Précisez votre secteur d'activité *</Label>
                <Input
                  id="custom_sector"
                  name="custom_sector"
                  placeholder="Ex: Artisanat"
                  value={formData.custom_sector}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contact@organisation.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+228 XX XX XX XX"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Votre message *</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Décrivez brièvement comment nous pourrions collaborer..."
              className="min-h-[120px] resize-y"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Envoyer la demande'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerRequestModal;
