import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { HTMLInputTypeAttribute } from "react";

export const FormFieldWrapper = ({
  name,
  label,
  placeholder,
  form,
  textarea,
  type,
}: {
  name: string;
  label?: string;
  placeholder: string;
  form: UseFormReturn<any, any, any>;
  textarea?: boolean;
  type?: HTMLInputTypeAttribute;
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          {textarea ? (
            <Textarea id={name} {...field} placeholder={placeholder} />
          ) : (
            <Input
              id={name}
              type={type ?? "text"}
              {...field}
              placeholder={placeholder}
            />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
