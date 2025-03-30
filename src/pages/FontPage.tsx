import Confirmation from "@/components/Confirmation";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { baseUrl } from "@/constant";
import { IFonts } from "@/types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Function to dynamically load fonts from backend
const loadFont = (
  fontName: string,
  fontFile: string,
  fontStyle: string,
  weight: string | number
) => {
  const fontPath = fontFile.replace(/\\/g, "/");

  const fontUrl = `${baseUrl}/${fontPath}`;

  const fontFace = new FontFace(
    fontName,
    `url(${fontUrl}) format("truetype")`,
    {
      style: fontStyle.toLowerCase(),
      weight: weight.toString(),
    }
  );

  fontFace
    .load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont);
    })
    .catch((error) => console.error("❌ Font loading error:", error));
};

export default function FontPage() {
  const [fonts, setFonts] = useState<IFonts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const fetchFonts = async () => {
      const res = await fetch(`${baseUrl}/api/v1/fonts`);

      const result = await res.json();

      setFonts(result?.data);
    };

    fetchFonts();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    Promise.all(
      fonts.map((font) =>
        loadFont(font.name, font.path, font.style, font.weight)
      )
    ).then(() => setFontsLoaded(true));
  }, [fonts]);

  const handleDeleteFont = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/fonts/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result?.success) {
        toast.success(result.message);
        setFonts(fonts.filter((font) => font._id !== id));
      } else {
        toast.success(result.message);
      }
    } catch {
      toast.error("Something wrong deleting font from DB");
    }
  };

  if (!fontsLoaded) return <Loading />;

  return (
    <>
      {isLoading && <Loading />}
      <Container>
        <Card className="p-4 rounded">
          <CardContent>
            <h2 className="text-xl font-semibold text-gray-700">Our Fonts</h2>
            <p className="text-sm text-gray-500">
              Browse a list of Zepto fonts to build your font group.
            </p>

            <motion.div
              className="overflow-hidden rounded-lg mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium text-gray-700">
                      Font Name
                    </th>
                    <th className="text-left p-2 font-medium text-gray-700">
                      Preview
                    </th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {fonts.map((font, index) => (
                    <motion.tr
                      key={font.name}
                      className="border-b"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <td className="p-2 text-gray-700">{font.name}</td>
                      <td
                        className="p-2 text-gray-600"
                        style={{
                          fontFamily: font.name,
                        }}
                      >
                        Example Style
                      </td>
                      <td className="p-2 text-right">
                        <Confirmation
                          onConfirm={() => handleDeleteFont(font._id)}
                        >
                          <Button
                            variant="ghost"
                            className="text-red-500 hover:text-red-600"
                          >
                            Delete
                          </Button>
                        </Confirmation>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
