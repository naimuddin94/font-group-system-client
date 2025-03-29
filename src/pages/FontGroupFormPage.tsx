import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { baseUrl } from "@/constant";
import { IFonts } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, GripVertical, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type FontEntry = {
  fontName: string;
  selectedFont: string;
  specificSize: string;
  priceChange: string;
};

type FormValues = {
  groupTitle: string;
  fonts: FontEntry[];
};

export default function FontGroupFormPage() {
  const [fonts, setFonts] = useState<IFonts[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFonts = async () => {
      const res = await fetch(`${baseUrl}/api/v1/fonts`);

      const result = await res.json();

      setFonts(result?.data);
    };

    fetchFonts();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      groupTitle: "",
      fonts: [
        {
          fontName: "",
          selectedFont: "",
          specificSize: "1.00",
          priceChange: "0",
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "fonts",
  });

  // State for tracking drag operation
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(
    null
  );

  // Animation state
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const onSubmit = async (data: FormValues) => {
    if (fields.length < 2) {
      return toast.error("At least two fonts are needed to form a group.");
    }

    try {
      const response = await fetch(`${baseUrl}/api/v1/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result?.success) {
        toast.success(result.message);
        navigate("/group-list");
        reset();
      } else {
        toast.success(result.message);
      }
    } catch {
      toast.error("Something wrong from server");
    }
  };

  const handleSizeChange = (
    index: number,
    type: "increment" | "decrement",
    currentValue: string
  ) => {
    const value = Number.parseFloat(currentValue) || 0;
    const step = 0.01;
    const newValue = type === "increment" ? value + step : value - step;
    const formattedValue = newValue.toFixed(2);
    setValue(`fonts.${index}.specificSize`, formattedValue);
    return formattedValue;
  };

  const handlePriceChange = (
    index: number,
    type: "increment" | "decrement",
    currentValue: string
  ) => {
    const value = Number.parseInt(currentValue) || 0;
    const step = 1;
    const newValue = type === "increment" ? value + step : value - step;
    const stringValue = newValue.toString();
    setValue(`fonts.${index}.priceChange`, stringValue);
    return stringValue;
  };

  // Custom drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverItemIndex(index);
  };

  const handleDragEnd = () => {
    if (
      draggedItemIndex !== null &&
      dragOverItemIndex !== null &&
      draggedItemIndex !== dragOverItemIndex
    ) {
      // Perform the move operation
      move(draggedItemIndex, dragOverItemIndex);
    }
    // Reset state
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  // Handle remove with animation
  const handleRemove = (index: number) => {
    if (fields.length <= 2) return; // Maintain minimum of 2 fields

    setRemovingIndex(index);
    // Wait for animation to complete before actually removing
    setTimeout(() => {
      remove(index);
      setRemovingIndex(null);
    }, 300); // Match animation duration
  };

  return (
    <>
      {isSubmitting && <Loading />}
      <div className="w-full max-w-5xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Create Font Group
          </h1>
          <p className="text-gray-600">You have to select at least two fonts</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Input
              placeholder="Group Title"
              {...register("groupTitle", { required: true })}
              className="w-full h-12 border-gray-300"
            />
            {errors.groupTitle && (
              <span className="text-red-500 text-sm">
                Group title is required
              </span>
            )}
          </div>

          <AnimatePresence initial={false}>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: removingIndex === index ? 0 : 1,
                  y: removingIndex === index ? -10 : 0,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    opacity: { duration: 0.2 },
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 0.2,
                  },
                }}
                layout
                className={`border rounded-md pb-3 pt-6 px-3 bg-white shadow-sm mb-3
                ${
                  draggedItemIndex === index
                    ? "opacity-50 border-dashed"
                    : "opacity-100"
                }
                ${dragOverItemIndex === index ? "border-primary border-2" : ""}
                ${removingIndex === index ? "pointer-events-none" : ""}
              `}
                draggable={true}
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={handleDragEnd}
                style={{
                  position: "relative",
                  zIndex: draggedItemIndex === index ? 10 : 1,
                }}
              >
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <motion.div
                    className="flex items-center justify-center px-1 cursor-grab active:cursor-grabbing touch-manipulation"
                    whileTap={{ scale: 0.95 }}
                  >
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </motion.div>

                  <div className="flex-1 min-w-[200px]">
                    <Input
                      placeholder="Font Name"
                      {...register(`fonts.${index}.fontName` as const, {
                        required: true,
                      })}
                      className="w-full border-gray-300"
                    />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <Controller
                      control={control}
                      name={`fonts.${index}.selectedFont` as const}
                      rules={{ required: "Font is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full border-gray-300">
                            <SelectValue placeholder="Select a Font" />
                          </SelectTrigger>
                          <SelectContent>
                            {fonts.map((font) => (
                              <SelectItem key={font._id} value={font._id}>
                                {font.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="w-[150px] -mt-5">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">
                        Specific Size
                      </label>
                      <div className="relative">
                        <Controller
                          control={control}
                          name={`fonts.${index}.specificSize` as const}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="pr-8 border-gray-300"
                            />
                          )}
                        />
                        <div className="absolute right-0 top-0 h-full flex flex-col border-l">
                          <button
                            type="button"
                            className="flex-1 px-2 flex items-center justify-center hover:bg-gray-100"
                            onClick={() => {
                              const currentValue = watch(
                                `fonts.${index}.specificSize`
                              );
                              handleSizeChange(
                                index,
                                "increment",
                                currentValue
                              );
                            }}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <div className="w-full h-px bg-gray-300" />
                          <button
                            type="button"
                            className="flex-1 px-2 flex items-center justify-center hover:bg-gray-100"
                            onClick={() => {
                              const currentValue = watch(
                                `fonts.${index}.specificSize`
                              );
                              handleSizeChange(
                                index,
                                "decrement",
                                currentValue
                              );
                            }}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-[150px] -mt-5">
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">
                        Price Change
                      </label>
                      <div className="relative">
                        <Controller
                          control={control}
                          name={`fonts.${index}.priceChange` as const}
                          render={({ field }) => (
                            <Input
                              {...field}
                              className="pr-8 border-gray-300"
                            />
                          )}
                        />
                        <div className="absolute right-0 top-0 h-full flex flex-col border-l">
                          <button
                            type="button"
                            className="flex-1 px-2 flex items-center justify-center hover:bg-gray-100"
                            onClick={() => {
                              const currentValue = watch(
                                `fonts.${index}.priceChange`
                              );
                              handlePriceChange(
                                index,
                                "increment",
                                currentValue
                              );
                            }}
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <div className="w-full h-px bg-gray-300" />
                          <button
                            type="button"
                            className="flex-1 px-2 flex items-center justify-center hover:bg-gray-100"
                            onClick={() => {
                              const currentValue = watch(
                                `fonts.${index}.priceChange`
                              );
                              handlePriceChange(
                                index,
                                "decrement",
                                currentValue
                              );
                            }}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-red-500 hover:text-red-700 p-1 self-center cursor-pointer disabled:text-red-200 disabled:cursor-not-allowed"
                    disabled={fields.length <= 2}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="mt-4 flex justify-between">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-50"
                onClick={() =>
                  append({
                    fontName: "",
                    selectedFont: "",
                    specificSize: "1.00",
                    priceChange: "0",
                  })
                }
              >
                + Add Row
              </Button>
            </motion.div>

            <Button
              disabled={fields.length < 2}
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white disabled:cursor-not-allowed"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
