import { h } from "preact";

const PrintGrid = ({ data }) => {
  const getItemPriority = (status) => {
    const priorities = {
      adopt: 1,
      decide: 2,
      assess: 3,
      open: 4,
      hold: 5,
    };
    return priorities[status.toLowerCase()] || 999;
  };

  const itemsByQuadrant = data.reduce((acc, item) => {
    const quadrant = item.Quadrant;
    if (!acc[quadrant]) acc[quadrant] = [];
    acc[quadrant].push(item);
    return acc;
  }, {});

  Object.keys(itemsByQuadrant).forEach((quadrant) => {
    itemsByQuadrant[quadrant].sort(
      (a, b) => getItemPriority(a.Status) - getItemPriority(b.Status),
    );
  });

  return (
    <div class="hidden print:block mt-12">
      <div class="grid grid-cols-4 gap-6 w-[800px]">
        {["Save", "Scale", "Secure", "Maintain"].map((quadrant) => (
          <div key={quadrant} class="break-inside-avoid">
            <h3 class="font-bold text-xl mb-4 pb-2 border-b-2 border-gray-200">
              {quadrant}
            </h3>
            <div class="space-y-4">
              {(itemsByQuadrant[quadrant] || []).map((item, index) => (
                <div
                  key={index}
                  class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div class="font-medium">{item.Name}</div>
                    <div class="text-sm px-2 py-1 rounded bg-gray-200 text-gray-700">
                      {item.Status}
                    </div>
                  </div>
                  <div class="text-sm text-gray-600 whitespace-pre-wrap">
                    {item.Description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintGrid;
