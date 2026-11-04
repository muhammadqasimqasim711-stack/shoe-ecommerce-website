import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ShoppingBag } from "lucide-react";

type FlyingParticle = {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  imgUrl?: string;
};

type PlusOneBadge = {
  id: string;
};

type FlyCartContextType = {
  flyToCart: (source: HTMLElement | React.MouseEvent | DOMRect | null, imageUrl?: string) => void;
  isCartBouncing: boolean;
  plusOneBadges: PlusOneBadge[];
  triggerCartImpact: () => void;
};

const FlyCartContext = createContext<FlyCartContextType>({
  flyToCart: () => {},
  isCartBouncing: false,
  plusOneBadges: [],
  triggerCartImpact: () => {},
});

export function FlyCartProvider({ children }: { children: ReactNode }) {
  const [flyingParticles, setFlyingParticles] = useState<FlyingParticle[]>([]);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [plusOneBadges, setPlusOneBadges] = useState<PlusOneBadge[]>([]);

  const triggerCartImpact = useCallback(() => {
    setIsCartBouncing(true);
    const badgeId = `badge-${Date.now()}-${Math.random()}`;
    setPlusOneBadges((prev) => [...prev, { id: badgeId }]);

    setTimeout(() => {
      setIsCartBouncing(false);
    }, 600);

    setTimeout(() => {
      setPlusOneBadges((prev) => prev.filter((b) => b.id !== badgeId));
    }, 900);
  }, []);

  const flyToCart = useCallback(
    (source: HTMLElement | React.MouseEvent | DOMRect | null, imageUrl?: string) => {
      let startX = window.innerWidth / 2;
      let startY = window.innerHeight / 2;
      let detectedImg: string | undefined = imageUrl;

      if (source) {
        if ("getBoundingClientRect" in source) {
          const rect = (source as HTMLElement).getBoundingClientRect();
          startX = rect.left + rect.width / 2;
          startY = rect.top + rect.height / 2;

          if (!detectedImg && source instanceof HTMLElement) {
            const imgEl = source.querySelector("img") as HTMLImageElement | null;
            if (imgEl && imgEl.src) {
              detectedImg = imgEl.src;
            }
          }
        } else if ("clientX" in source) {
          const mouseEvent = source as React.MouseEvent;
          startX = mouseEvent.clientX;
          startY = mouseEvent.clientY;
          if (!detectedImg && mouseEvent.currentTarget instanceof HTMLElement) {
            const imgEl = mouseEvent.currentTarget.querySelector("img") as HTMLImageElement | null;
            if (imgEl && imgEl.src) {
              detectedImg = imgEl.src;
            }
          }
        }
      }

      const cartTarget = document.querySelector("[data-cart-target]");
      let endX = window.innerWidth - 60;
      let endY = 40;

      if (cartTarget) {
        const cartRect = cartTarget.getBoundingClientRect();
        endX = cartRect.left + cartRect.width / 2;
        endY = cartRect.top + cartRect.height / 2;
      }

      const particleId = `particle-${Date.now()}-${Math.random()}`;
      setFlyingParticles((prev) => [
        ...prev,
        {
          id: particleId,
          startX,
          startY,
          endX,
          endY,
          imgUrl: detectedImg,
        },
      ]);

      // Trigger impact animation after flight duration (600ms)
      setTimeout(() => {
        triggerCartImpact();
        setFlyingParticles((prev) => prev.filter((p) => p.id !== particleId));
      }, 620);
    },
    [triggerCartImpact],
  );

  return (
    <FlyCartContext.Provider
      value={{
        flyToCart,
        isCartBouncing,
        plusOneBadges,
        triggerCartImpact,
      }}
    >
      {children}

      {/* Render flying product particles overlay */}
      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
        {flyingParticles.map((particle) => {
          const deltaX = particle.endX - particle.startX;
          const deltaY = particle.endY - particle.startY;
          // Curve arc height based on distance
          const arcHeight = Math.min(Math.abs(deltaX) * 0.35 + 80, 200);

          return (
            <div
              key={particle.id}
              className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background border-2 border-accent shadow-2xl p-1 overflow-hidden"
              style={{
                left: `${particle.startX}px`,
                top: `${particle.startY}px`,
                animation: `flyArc-${particle.id} 0.62s cubic-bezier(0.2, 0.8, 0.25, 1) forwards`,
              }}
            >
              <style>{`
                @keyframes flyArc-${particle.id} {
                  0% {
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                    opacity: 1;
                  }
                  45% {
                    transform: translate(calc(-50% + ${deltaX * 0.4}px), calc(-50% + ${
                      deltaY * 0.45 - arcHeight
                    }px)) scale(0.85) rotate(180deg);
                    opacity: 0.95;
                  }
                  100% {
                    transform: translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0.18) rotate(360deg);
                    opacity: 0;
                  }
                }
              `}</style>
              {particle.imgUrl ? (
                <img
                  src={particle.imgUrl}
                  alt=""
                  className="h-full w-full object-cover rounded-xl"
                />
              ) : (
                <div className="h-full w-full bg-accent text-accent-foreground grid place-items-center rounded-xl">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </FlyCartContext.Provider>
  );
}

export function useFlyCart() {
  return useContext(FlyCartContext);
}
