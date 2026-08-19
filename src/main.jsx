import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "jodit/es2021/jodit.min.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./page/redux/store";

createRoot(document.getElementById("root")).render(
 <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
