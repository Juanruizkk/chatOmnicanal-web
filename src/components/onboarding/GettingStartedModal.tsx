import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { GettingStartedCard } from "./GettingStartedCard"

interface GettingStartedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GettingStartedModal({
  open,
  onOpenChange,
}: GettingStartedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl max-h-[85vh] p-0 overflow-hidden border shadow-2xl flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Guía de Primeros Pasos</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <GettingStartedCard
            onClose={() => onOpenChange(false)}
            showDismiss={false}
            className="border-0 shadow-none rounded-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
