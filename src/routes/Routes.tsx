import MainLayout from "@/layout/MainLayout";
import FontGroupFormPage from "@/pages/FontGroupFormPage";
import FontPage from "@/pages/FontPage";
import GroupPage from "@/pages/GroupPage";
import GroupUpdatePage from "@/pages/GroupUpdatePage";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/fonts",
        element: <FontPage />,
      },
      {
        path: "/create-fonts-group",
        element: <FontGroupFormPage />,
      },
      {
        path: "/update-group/:groupId",
        element: <GroupUpdatePage />,
      },
      {
        path: "/group-list",
        element: <GroupPage />,
      },
    ],
  },
]);
