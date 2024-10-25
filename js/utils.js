// Info: Function to get element by Id. Purpose is to keep the process short and clean
const getById = (elementId) => {
  return document.getElementById(elementId);
};

// Info: A function to set the active status of a post
const setActiveStatus = (isActive, elementId) => {
  const activeStatus = getById(elementId);
  isActive
    ? activeStatus.classList.add("bg-[#10b981]")
    : activeStatus.classList.add("bg-[#ff3434]");
};
