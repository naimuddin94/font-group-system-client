import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { baseUrl } from "@/constant";
import { IFonts } from "@/types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Function to dynamically load fonts from backend
const loadFont = (fontName: string, fontFile: string, fontStyle: string) => {
  const fontPath = fontFile.replace(/\\/g, "/");

  const fontUrl = `${baseUrl}/${fontPath}`;

  const fontFace = new FontFace(
    fontName,
    `url(${fontUrl}) format("truetype")`,
    {
      style: fontStyle.toLowerCase(),
      weight: "normal",
    }
  );

  fontFace
    .load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont);
      console.log(`✅ Loaded font: ${fontName} - ${fontStyle}`);
    })
    .catch((error) => console.error("❌ Font loading error:", error));
};

export default function FontPage() {
  const [fonts, setFonts] = useState<IFonts[]>([]);

  useEffect(() => {
    const fetchFonts = async () => {
      const res = await fetch(`${baseUrl}/api/v1/fonts`);

      const result = await res.json();

      setFonts(result?.data);
    };

    fetchFonts();
  }, []);

  useEffect(() => {
    fonts.forEach((font) => loadFont(font.name, font.path, font.style));
  }, [fonts]);

  return (
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
                      style={{ fontFamily: font.name }}
                    >
                      Example Style
                    </td>
                    <td className="p-2 text-right">
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                      >
                        Delete
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </CardContent>
      </Card>
    </Container>
  );
}
