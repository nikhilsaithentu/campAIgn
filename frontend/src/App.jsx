import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import Analytics from "./pages/Analytics";
import Targeting from "./pages/Audience";
import Insights from "./pages/Copilot";
import ContentStudio from "./pages/ContentStudio";
import Chatbot from "./components/chat/Chatbot";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={<Layout />}>

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="campaigns"
            element={<Campaigns />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            path="targeting"
            element={<Targeting />}
          />

          <Route
            path="insights"
            element={<Insights />}
          />

          <Route
          path="/content"
          element={<ContentStudio />}
          />

        </Route>

      </Routes>
      <Chatbot />

    </BrowserRouter>
  );
}