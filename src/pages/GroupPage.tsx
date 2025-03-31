import Confirmation from "@/components/Confirmation";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { baseUrl } from "@/constant";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FontGroup {
  _id: string;
  groupTitle: string;
  fonts: {
    fontName: string;
    priceChange: number;
    selectedFont: string;
    specificSize: number;
  }[];
}

export default function GroupPage() {
  const [fontGroups, setFontGroups] = useState<FontGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await fetch(`${baseUrl}/api/v1/groups`);

      const result = await res.json();

      setFontGroups(result?.data);
    };

    fetchGroups();
    setIsLoading(false);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/groups/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result?.statusCode === 200) {
        toast.success(result.message);
        setFontGroups(fontGroups.filter((group) => group._id !== id));
      } else {
        toast.success(result.message);
      }
    } catch {
      toast.error("Something wrong deleting group from DB");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/update-group/${id}`);
  };

  return (
    <>
      {isLoading && <Loading />}
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-sm rounded">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-800">
                Our Font Groups
              </CardTitle>
              <CardDescription>
                List of all available font groups.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fontGroups.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] font-medium text-gray-700">
                        NAME
                      </TableHead>
                      <TableHead className="font-medium text-gray-700">
                        FONTS
                      </TableHead>
                      <TableHead className="w-[100px] font-medium text-gray-700">
                        COUNT
                      </TableHead>
                      <TableHead className="w-[150px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {fontGroups.map((group, index) => (
                        <motion.tr
                          key={group._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                            exit: { duration: 0.2 },
                          }}
                          layout
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <TableCell className="font-medium text-gray-700">
                            {group.groupTitle}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {group.fonts.map((f) => (
                              <span key={f.fontName}>{f.fontName}, </span>
                            ))}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {group.fonts.length}
                          </TableCell>
                          <TableCell className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              onClick={() => handleEdit(group._id)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto"
                            >
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Edit
                              </motion.span>
                            </Button>

                            <Confirmation
                              onConfirm={() => handleDelete(group._id)}
                            >
                              <Button
                                variant="ghost"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-auto"
                              >
                                <motion.span
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Delete
                                </motion.span>
                              </Button>
                            </Confirmation>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              ) : (
                <div>
                  <h2 className="text-center text-slate-500 py-5 text-lg">
                    No available group found
                  </h2>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </>
  );
}
