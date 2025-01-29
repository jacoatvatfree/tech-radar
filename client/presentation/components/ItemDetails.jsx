import { h } from "preact";

const ItemDetails = ({ item, mousePos }) => {
  if (!item) return null;

  return (
    <div
      class="absolute bg-white p-6 rounded-xl shadow-xl border border-gray-200"
      style={{
        left: mousePos.x < 400 ? "420px" : "20px",
        top: "20px",
        width: "360px",
        maxHeight: "560px",
        overflow: "auto",
      }}
    >
      <h3 class="font-bold text-xl mb-4 pb-2 border-b-2 border-gray-100">
        {item.Name}
      </h3>

      <div class="bg-gray-50 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-[120px_1fr] gap-3 text-sm">
          <div class="text-gray-600 font-medium">Status:</div>
          <div class="font-semibold">{item.Status}</div>
          <div class="text-gray-600 font-medium">Quadrant:</div>
          <div class="font-semibold">{item.Quadrant}</div>
          <div class="text-gray-600 font-medium">Owner:</div>
          <div class="font-semibold">{item.People}</div>
          <div class="text-gray-600 font-medium">Date:</div>
          <div class="font-semibold">
            {new Date(item.Date).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div class="bg-blue-50 rounded-lg p-4">
        <div class="text-blue-800 font-medium mb-2">Description</div>
        <div class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {item.Description}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
