import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { JsonViewerLazy } from "./ui/LAZY_COMPONENT";
import ModalViewerJSON from "./ui/ModalViewer";
import ReactSVG from "./ui/react";
import toast, { Toaster } from "react-hot-toast";
import { JsonDiffLazy } from "./ui/LAZY_COMPONENT";
import JWTDecode from "./ui/DecodeJWT";
import { ModalViewer } from "./ui/Difftext";
import Aurora from "./ui/Aurora";
import { BaseModal } from "./ui/BaseModal";
import ContainerDescripcion from "./components/DESCRIPCION";
import ToolBar from "./components/TOOLBAR.";
import ContainerTextArea from "./components/TEXTAREA-EDITOR";

const App = () => {
  const [value, setValue] = useState<string | null | undefined>(
    localStorage.getItem("jsonData") || null,
  );
  const [isValid, setIsValid] = useState(true);
  const [error, setErrorMessage] = useState("");
  const [openAll, setOpenAll] = useState<boolean>(false);
  const [isOpenDiff, setIsOpenDiff] = useState<boolean>(false);
  const [isOpenDiffText, setIsOpenDiffText] = useState<boolean>(false);
  const [isDecode, setIsDecode] = useState<boolean>(false);

  // // Leer datos desde la URL si existen
  // useEffect(() => {
  //   const url = new URL(window.location.href);
  //   const dataQuery = url.searchParams.get("jsdata");

  //   if (dataQuery) {
  //     try {
  //       const decoded = decodeURIComponent(escape(atob(dataQuery)));
  //       setShareUrl(decoded);
  //       setValue(decoded);
  //       console.log("Datos recuperados de la URL:", decoded);
  //     } catch (err) {
  //       toast.error(" Ereror al decodificar el JSON desde la URL");
  //       console.error(" dError al decodificar:", err);
  //     }
  //   }
  // }, []);

  // // Actualizar la URL cuando cambia el valor
  // useEffect(() => {
  //   if (!value) return;

  //   const url = new URL(window.location.href);
  //   const encoded = btoa(unescape(encodeURIComponent(value)));
  //   url.searchParams.set("jsdata", encoded);
  //   window.history.replaceState({}, "", url);
  // }, [value]);

  // Validar el JSON
  useEffect(() => {
    try {
      JSON.parse(value);
      setIsValid(true);
      setErrorMessage("");
    } catch {
      setIsValid(false);
      setErrorMessage("JSON inválido. Por favor verifica tu entrada.");
    }
  }, [value]);

  const handleClear = () => {
    if (localStorage.getItem("jsonData") === null) {
      toast.error("No hay nada que limpiar.");
      return;
    }
    setValue(null);
    localStorage.removeItem("jsonData");
    toast.success("Limpiado exitosamente.");
  };

  const handleClickCargueJson = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.txt";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setValue(result);
        };
        reader.readAsText(file);
      }
    };

    input.click();
  };

  const handleClickOpenModal = () => setOpenAll(!openAll);

  const handleClickminifyJson = () => {
    try {
      const parseado = JSON.parse(value);
      console.log(parseado);
      setValue(JSON.stringify(parseado));

      toast.success("JSON minificado");
    } catch {
      toast.error("JSON inválido para minificar");
    }
  };

  const handleCopy = () => {
    if (value.length > 0) {
      try {
        navigator.clipboard
          .writeText(value)
          .then(() => toast.success("Copiado exitosamente"));
      } catch {
        toast.error("Ocurrio un error al copiar.");
      }
      return;
    }

    toast.error("No tienes nada para copiar en tu Text Area.");
  };

  const handleCopyUrl = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(value)));
      const url = new URL(window.location.href);
      url.searchParams.set("jsdata", encoded);
      const fullUrl = url.toString();

      navigator.clipboard
        .writeText(fullUrl)
        .then(() => {
          toast.success("Direccion copiada con exito.");
        })
        .catch(() => {
          toast.error("No se pudo copiar la URL");
        });
    } catch {
      toast.error("Error al generar URL compartible");
    }
  };

  return (
    <>
      <div className="relative">
        <Aurora
          colorStops={["#27272a", "#4fbed6", "#18181b"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        {/* Modal para JSON Viewer */}
        <BaseModal isOpen={openAll} onClose={() => setOpenAll(false)}>
          <ModalViewerJSON value={value} />
        </BaseModal>

        {/* Modal para JWT Decode */}
        <BaseModal isOpen={isDecode} onClose={() => setIsDecode(false)}>
          <JWTDecode />
        </BaseModal>

        {/* Modal para Diff Text */}
        <BaseModal
          isOpen={isOpenDiffText}
          onClose={() => setIsOpenDiffText(false)}
        >
          <ModalViewer />
        </BaseModal>

        {/* Modal para JSON Diff */}
        <BaseModal isOpen={isOpenDiff} onClose={() => setIsOpenDiff(false)}>
          <JsonDiffLazy />
        </BaseModal>
        <div className="bg-gradient-to-b from-zinc-950 to-zinc-800/100 text-zinc-200 min-h-screen font-mono">
          <Toaster
            toastOptions={{
              className: "bg-zinc-800! text-zinc-400!",
            }}
          />
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 min-h-screen p-5">
            <aside className="w-full lg:w-64 grid gap-5  rounded-2xl">
              <ToolBar
                handleClear={handleClear}
                handleClickCargueJson={handleClickCargueJson}
                handleClickminifyJson={handleClickminifyJson}
                handleCopy={handleCopy}
                handleCopyUrl={handleCopyUrl}
                isDecode={isDecode}
                setIsDecode={setIsDecode}
                isOpenDiff={isOpenDiff}
                setIsOpenDiff={setIsOpenDiff}
                setIsOpenDiffText={setIsOpenDiffText}
                isOpenDiffText={isOpenDiffText}
                classNameContainer="p-6 shadow-2xl rounded-2xl backdrop-blur"
              />

              <ContainerDescripcion />
            </aside>



            <main className="flex-1 space-y-6">
            <ContainerTextArea value={value} setValue={setValue} />
              

              <section className="rounded-xl backdrop-blur  shadow-2xl bg-zinc-900/80 p-6 flex flex-col gap-y-3">
                <div className="p-2 flex justify-between">
                  <label className="bg-gradient-to-bl from-white to-zinc-600 bg-clip-text text-transparent">
                    Resultado Formateado
                  </label>
                  <div className=" flex justify-center items-center gap-2">
                    <button
                      className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-1 py-1 rounded-md transition"
                      onClick={handleClickOpenModal}
                    >
                      <Icon icon="tabler:maximize" width="15" height="15" />
                    </button>
                  </div>
                </div>

                <div className="text-sm whitespace-pre-wrap break-words break-all overflow-auto h-fit">
                  <JsonViewerLazy
                    data={value}
                    isOpen={openAll}
                    height="20vh"
                    maxHeight="20vh"
                  />
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
