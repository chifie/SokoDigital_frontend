import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

export function LanguageSelector() {
  const { lang, setLang } = useLang();

  const languages = [
    { code: "en" as const, nativeName: "English", name: "English" },
    { code: "sw" as const, nativeName: "Kiswahili", name: "Swahili" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 rounded-full border border-white/20 px-3 text-xs font-medium text-white hover:bg-white/10 transition-all duration-200"
        >
          <Globe className="h-3.5 w-3.5 text-white/70" />
          {lang.toUpperCase()}
          <ChevronDown className="h-3 w-3 text-white/50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {languages.map((l) => (
              <DropdownMenuItem
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`gap-3 cursor-pointer ${
                  lang === l.code ? "bg-primary/5 font-medium" : ""
                }`}
              >
                <span className="text-xs">{l.nativeName}</span>
                <span className="text-[10px] text-muted-foreground ml-auto">
                  {l.name}
                </span>
              </DropdownMenuItem>
            ))}
          </motion.div>
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
