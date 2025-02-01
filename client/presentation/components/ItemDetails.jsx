import { h } from "preact";

const ItemDetails = ({ item, mousePos }) => {
  if (!item) return null;

  return (
<div
  class="absolute bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 dark:text-white"
  style={{
        left: mousePos.x < 400 ? "calc(50% + 20px)" : "calc(50% - 380px)",
    top: "20px",
    width: "360px",
    maxHeight: "560px",
    overflow: "auto",
  }}
>
      <h3 class="font-bold text-xl mb-4 pb-2 border-b-2 border-gray-100 dark:border-gray-600 text-gray-900 dark:text-white">
        {item.Name}
      </h3>

      <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4">
      <div class="grid grid-cols-[120px_1fr] gap-3 text-sm">
        <div class="text-gray-600 dark:text-gray-300 font-medium">Status:</div>
        <div class="font-semibold text-gray-800 dark:text-gray-100">{item.Status}</div>
        <div class="text-gray-600 dark:text-gray-300 font-medium">Quadrant:</div>
        <div class="font-semibold text-gray-800 dark:text-gray-100">{item.Quadrant}</div>
        <div class="text-gray-600 dark:text-gray-300 font-medium">Owner:</div>
        <div class="font-semibold text-gray-800 dark:text-gray-100">{item.People}</div>
        <div class="text-gray-600 dark:text-gray-300 font-medium">Date:</div>
        <div class="font-semibold text-gray-800 dark:text-gray-100">
            {new Date(item.Date).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div class="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
        <div class="text-blue-900 dark:text-blue-300 font-medium mb-2">Description</div>
        <div class="text-sm text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
          {item.Description}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
