import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "peer relative w-full bg-transparent outline-none transition-all duration-500",
  {
    variants: {
      variant: {
        default: "border-foreground px-3 py-2 h-10 text-base shadow-[4px_2px_0px_0px] shadow-foreground focus:shadow-none rounded-xl",
        outline: "border border-input px-3 py-2 h-10 rounded-xl",
        ghost: "px-3 py-2 h-10",
        textarea: "border-foreground px-3 py-2 min-h-[80px] text-base shadow-[4px_2px_0px_0px] shadow-foreground focus:shadow-none rounded-xl resize-y",
      },
      inputSize: {
        default: "h-10",
        sm: "h-8 text-sm",
        lg: "h-12 w-full text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

type InputVariantsProps = VariantProps<typeof inputVariants>

interface BaseProps {
  label?: string
  variant?: InputVariantsProps["variant"]
  inputSize?: InputVariantsProps["inputSize"]
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseProps {
  type?: "text" | "number" | "email" | "password" | "tel" | "url" | "search"
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, BaseProps {
  type: "textarea"
}

export type InputProps = TextInputProps | TextareaProps

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, variant, inputSize, label, type = "text", ...props }, ref) => {
    const id = React.useId()
    
    const inputClassName = cn(
      inputVariants({ 
        variant: type === "textarea" ? "textarea" : variant, 
        inputSize, 
        className 
      })
    )

    return (
      <div className="relative">
        {type === "textarea" ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputClassName}
            id={id}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            type={type}
            ref={ref as React.Ref<HTMLInputElement>}
            className={inputClassName}
            id={id}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "absolute left-3 transform text-base transition-all duration-500",
              "top-2.5 scale-100",
              "peer-focus:-top-2 peer-focus:scale-75",
              "peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:scale-75"
            )}
          >
            {label}
          </label>
        )}
        <div 
          className={cn(
            "absolute right-0 top-0 h-0.5 bg-primary transition-all duration-500",
            "w-0 peer-focus:w-[35%]"
          )} 
        />
        <div 
          className={cn(
            "absolute right-0 bottom-0 h-0.5 bg-primary transition-all duration-500",
            "w-0 peer-focus:w-full"
          )} 
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }