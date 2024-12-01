import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Toaster, toast } from "sonner";

interface MenuItem {
  name: string;
  price: string;
  description: string;
  category: string;
  aiDescription?: string;
}

export default function ImageUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<{ menuItems: MenuItem[] } | null>(
    null
  );
  const [groupedItems, setGroupedItems] = useState<Record<string, MenuItem[]>>(
    {}
  );

  const fetchMenuItemDescriptions = async (items: MenuItem[]) => {
    const updatedItems = await Promise.all(
      items.map(async (item) => {
        try {
          const response = await fetch("/api/menuItemDes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: item.name }),
          });
          const data = await response.json();
          return { ...item, aiDescription: data.result };
        } catch (error) {
          console.error(`Error fetching description for ${item.name}:`, error);
          return item;
        }
      })
    );
    return updatedItems;
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      setError("Please upload only PNG, JPG or JPEG images");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const response = await fetch("/api/img", {
        method: "POST",
        body: buffer,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Fetch descriptions for all items
      const itemsWithDescriptions = await fetchMenuItemDescriptions(
        data.menuItems
      );

      // Group items by category with descriptions
      const groupedItems = itemsWithDescriptions.reduce(
        (acc: Record<string, MenuItem[]>, item: MenuItem) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        },
        {}
      );

      setMenuData({ menuItems: itemsWithDescriptions });
      setGroupedItems(groupedItems);

      toast.success("Menu Uploaded Successfully!", {
        description: `${data.menuItems.length} menu items extracted and categorized`,
        duration: 1500,
        className: "my-toast",
      });
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload image");
      toast.error("Failed to process menu image", {
        description: "Please try again with a clearer image",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: false,
  });
  return (
    <div className="w-full max-w-6xl mx-auto">
      <Toaster />
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-violet-500 bg-violet-50"
              : "border-gray-300 hover:border-violet-400"
          }
          ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />

        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-gray-600">
            <span className="font-medium text-violet-600">
              Upload your restaurant menu
            </span>
            <p className="text-sm mb-1">
              Drag and drop an image here, or click to browse
            </p>
            <p className="text-xs text-gray-500">
              Accepted formats: PNG, JPG, JPEG (max 10MB)
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
            <svg
              className="animate-spin h-10 w-10 text-violet-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      {menuData && menuData.menuItems && (
        <div className="mt-8">
          {/* <div className="font-medium mb-4 text-lg">Extracted Menu Items:</div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.entries(groupedItems) as [string, MenuItem[]][]).map(
              ([category, items]) => (
                <div
                  key={category}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="text-lg font-semibold text-violet-600 mb-3 pb-2 border-b">
                    {category}
                  </div>
                  <ul className="space-y-3">
                    {items.map((item: MenuItem, index: number) => (
                      <li key={index} className="text-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-violet-600 font-medium ml-2">
                            {item.price}
                          </span>
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </div>
                        )}
                        {item.aiDescription && (
                          <div className="text-xs text-gray-600 mt-2">
                            {item.aiDescription}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
          {(!menuData.menuItems || menuData.menuItems.length === 0) && (
            <p className="text-sm text-gray-600">No menu items detected</p>
          )}
        </div>
      )}
    </div>
  );
}
