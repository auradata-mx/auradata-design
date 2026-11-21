import { cn } from "cn"

/** The Continua logo files, as the registry installs them into public/brand/continua. */
const BASE_PATH = "/brand/continua"

const SIZES = {
  horizontal: { width: 680, height: 144, file: "horizontal" },
  vertical: { width: 480, height: 420, file: "vertical" },
  mark: { width: 260, height: 175, file: "isotipo" },
} as const

type Layout = keyof typeof SIZES
/** "auto" is the color logo in light and the white one in dark. "texto-degradado" has no mark. */
type Variant = "auto" | "color" | "negro" | "blanco" | "texto-degradado"

type LogoProps = Omit<React.ComponentProps<"img">, "src" | "width" | "height"> & {
  layout?: Layout
  variant?: Variant
  basePath?: string
}

/** The AuraData logo. Size it with a height class (h-6, h-8): the width follows. */
function Logo({
  layout = "horizontal",
  variant = "auto",
  basePath = BASE_PATH,
  alt = "AuraData",
  className,
  ...props
}: LogoProps) {
  const { width, height, file } = SIZES[layout]
  const src = (name: Exclude<Variant, "auto">) => `${basePath}/${file}-${name}.svg`
  const image = (name: Exclude<Variant, "auto">, extra?: string) => (
    <img
      data-slot="logo"
      src={src(name)}
      width={width}
      height={height}
      alt={alt}
      className={cn("h-8 w-auto", extra, className)}
      {...props}
    />
  )
  if (variant !== "auto") return image(variant)
  return (
    <>
      {image("color", "dark:hidden")}
      {image("blanco", "hidden dark:block")}
    </>
  )
}

/** The product next to the logo ("BI"), in the brand gradient: the one place the gradient lives on text. */
function ProductTag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="product-tag"
      className={cn(
        "border-l border-border bg-(image:--gradient-brand) bg-clip-text pl-3 text-base leading-5 font-bold tracking-[0.02em] text-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Logo, ProductTag }
