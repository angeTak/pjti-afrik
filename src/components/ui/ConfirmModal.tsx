import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = 'danger'
}: ConfirmModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-3xl border-none shadow-2xl overflow-hidden p-0 max-w-md">
        <div className={`h-2 w-full ${variant === 'danger' ? 'bg-red-500' : 'bg-amber-500'}`} />
        
        <div className="p-8">
          <AlertDialogHeader>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
              variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {variant === 'danger' ? <Trash2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>
            <AlertDialogTitle className="text-2xl font-black text-slate-900 leading-tight">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-base pt-2">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="mt-10 gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 hover:text-slate-900 transition-all py-6 px-6">
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
                onClose();
              }}
              className={`rounded-2xl font-black py-6 px-8 transition-all shadow-lg ${
                variant === 'danger' 
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200' 
                  : 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-200'
              }`}
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
