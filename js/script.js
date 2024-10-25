// info: Function to show the loader for 2 seconds on website load or reload
window.onload = function () {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("body-contents").classList.remove("hidden");
  }, 2000);
};

// info: Fetch data from the all posts API
const getAllPosts = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/retro-forum/posts"
  );
  const json = await response.json();
  const allPosts = json.posts;
  showAllPosts(allPosts);
};

// info: Show all the posts in the let's discuss section
const showAllPosts = (allPosts) => {
  const postCardsContainer = getById("post-cards-container");
  postCardsContainer.innerHTML = "";

  //   show all the posts inside the post cards container of let's discuss section
  allPosts.forEach((post) => {
    const postCard = document.createElement("div");
    postCard.classList =
      "post-card border border-transparent bg-[#f3f3f5] rounded-3xl hover:bg-[#797DFC1A] hover:border-[#797dfc] duration-200 p-4 lg:flex lg:gap-6 lg:p-10";

    postCard.innerHTML = `
    <!-- post image container -->
                <div
                  class="post-image-container relative min-h-[4.5rem] max-h-[4.5rem] min-w-[4.5rem] max-w-[4.5rem]  rounded-2xl"
                >
                  <img src=${post?.image} alt="" class="rounded-2xl"/>
                  <span
                    id="active-status-${post?.id}"
                    class="active-status absolute h-[1.16875rem] w-[1.16875rem] rounded-full  -right-1 -top-1"
                  ></span>
                </div>

                <!-- Post content container -->
                <div class="post-content-container w-full">
                  <div
                    class="category-author-title-description-container border-b-[3px] border-dashed border-[#12132D40] pb-3 mb-5 lg:pb-5"
                  >
                    <div
                      class="category-and-author text-sm font-medium text-[#12132DCD] flex gap-5 my-2 lg:mt-0 lg:mb-3"
                    >
                      <p># <span>${post?.category}</span></p>
                      <p>Author : <span>${post?.author?.name}</span></p>
                    </div>

                    <h3
                      class="post-title text-xl font-bold text-[#12132d] mb-2 lg:mb-4"
                    >
                      ${post?.title}
                    </h3>

                    <p
                      class="post-description text-[#12132D96] leading-relaxed"
                    >
                      ${post.description}
                    </p>
                  </div>

                  <div
                    class="comments-views-time-mark-as-read-btn-container text-[#12132D99] text-sm flex items-center justify-between w-full lg:text-base"
                  >
                    <div class="flex items-center gap-3 lg:gap-6">
                      <p class="flex items-center gap-1 lg:gap-3">
                        <img
                          src="./assets/images/post-comments-icon.svg"
                          alt=""
                        />
                        <span>${post?.comment_count}</span>
                      </p>

                      <p class="flex items-center gap-1 lg:gap-3">
                        <img src="./assets/images/post-views-icon.svg" alt="" />
                        <span>${post?.view_count}</span>
                      </p>

                      <p class="flex items-center gap-1 lg:gap-3">
                        <img src="./assets/images/post-time-icon.svg" alt="" />
                        <span><span>${post?.posted_time}</span> min</span>
                      </p>
                    </div>

                    <button
                      id="mark-as-read-btn-${post?.id}"
                      class="mark-as-read-btn shrink-button active:bg-transparent"
                    >
                      <img src="./assets/images/mark-as-read-icon.svg" alt="" />
                    </button>
                  </div>
                </div>
    `;

    postCardsContainer.appendChild(postCard);

    //  A function to set the active status of the post according to the API "isActive" boolean field
    setActiveStatus(post?.isActive, `active-status-${post?.id}`);

    const markAsReadBtn = getById(`mark-as-read-btn-${post?.id}`);
    const tileCardsContainer = getById("title-cards-container");
    const markAsReadPostsCountContainer = getById("mark-as-read-posts-count");

    // Add event listener to the mark as read button
    markAsReadBtn.addEventListener("click", () => {
      markAsReadButtonClickHandler(
        tileCardsContainer,
        post?.title,
        post?.view_count,
        markAsReadPostsCountContainer
      );
    });
  });
};

// Info: A function for the functionality of mark as read button
const markAsReadButtonClickHandler = (
  titleCardsContainer,
  postTitle,
  postViewCount,
  markAsReadPostsCountContainer
) => {
  const titleCard = document.createElement("div");
  titleCard.classList =
    "title-card bg-white rounded-2xl flex flex-col gap-2 p-3 lg:flex-row lg:items-center lg:justify-between lg:p-4";

  titleCard.innerHTML = `
        <p class="text-[#12132d] leading-relaxed font-semibold">
            ${postTitle}
        </p>
        <p class="flex items-center gap-1 text-[#12132d99] text-sm min-w-20 lg:gap-2 lg:text-base">
            <img src="./assets/images/post-views-icon.svg" alt="" />
            <span>${postViewCount}</span>
        </p>
    `;

  titleCardsContainer.appendChild(titleCard);

  //   Functionality to count the mark as read posts and show it in the UI
  markAsReadPostsCount =
    titleCardsContainer.getElementsByClassName("title-card");
  markAsReadPostsCountContainer.innerText = markAsReadPostsCount.length;
};

// Info: Add event listener to the search button
const searchBtn = getById("search-btn");
searchBtn.addEventListener("click", () => {
  // Trim the value to get rid of empty spaces before and after the value
  const searchCategoryText = getById("category-input-field").value.trim();

  //   Condition to see if someone clicked the search button with the searchbar empty and show an error message
  //  note: If the search button is clicked with the searchbar empty, it will show all the posts
  if (!searchCategoryText) {
    getById("error-text").classList.remove("hidden");
    getAllPosts();
  } else {
    getById("error-text").classList.add("hidden");

    //   Make the value of the search input field capitalized
    const searchCategory =
      searchCategoryText[0].toUpperCase() +
      searchCategoryText.slice(1).toLowerCase();

    // call the search function callback
    handleSearchBtn(searchCategory);
  }
});

// Info: Function for the search button functionality
const handleSearchBtn = async (searchCategoryName) => {
  // get the loader element
  const loader = getById("search-loader");
  loader.classList.remove("hidden");

  //   get the post-cards-container element
  const postCardsContainer = getById("post-cards-container");
  postCardsContainer.classList.add("hidden");

  setTimeout(async () => {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/retro-forum/posts?category=${searchCategoryName}`
    );
    const json = await response.json();
    const searchedPosts = json.posts;

    showAllPosts(searchedPosts);

    // hide the loader and show the post-cards-container
    loader.classList.add("hidden");
    postCardsContainer.classList.remove("hidden");
  }, 2000);
};

// Info: Function to fetch the latest posts
const getLatestPosts = async () => {
  const response = await fetch(
    "https://openapi.programming-hero.com/api/retro-forum/latest-posts"
  );
  const json = await response.json();
  const latestPosts = json;

  showLatestPosts(latestPosts);
};

// Info: Function to show the latest posts
const showLatestPosts = (latestPosts) => {
  const latestPostsCardsContainer = getById("latest-posts-cards-container");

  latestPosts.forEach((latestPost) => {
    const latestPostCard = document.createElement("div");
    latestPostCard.classList = "latest-post-card border rounded-3xl p-4 lg:p-6";
    latestPostCard.innerHTML = `
              <div
                class="card-img w-full rounded-[1.25rem] min-h-48 mb-4 lg:mb-6"
              >
                <img src=${
                  latestPost?.cover_image
                } alt="" class="rounded-[1.25rem]"/>
              </div>

              <!-- card contents -->
              <div class="card-contents">
                <div
                  class="latest-post-date flex items-center gap-2 mb-3 lg:mb-4"
                >
                  <img src="./assets/images/post-date-icon.svg" alt="" />
                  <p class="text-[#12132d99]">${
                    latestPost?.author?.posted_date || "No publish date"
                  }</p>
                </div>

                <h3
                  class="latest-post-title text-lg text-[#12132d] font-extrabold leading-relaxed mb-1.5 lg:mb-3"
                >
                  ${latestPost?.title}
                </h3>

                <p
                  class="latest-post-description text-[#12132d99] leading-relaxed mb-4"
                >
                  ${latestPost?.description}
                </p>

                <div
                  class="latest-post-author-info flex items-center gap-2 lg:gap-4"
                >
                  <img
                    src=${latestPost?.profile_image}
                    alt=""
                    class="author-img w-11 h-11 rounded-full bg-gray-400"
                  />

                  <div>
                    <h4 class="author-name text-[#12132d] font-bold mb-1">
                      ${latestPost?.author?.name}
                    </h4>
                    <p class="author-occupation text-[#12132d99] text-sm">
                      ${latestPost?.author?.designation || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
  `;

    latestPostsCardsContainer.appendChild(latestPostCard);
  });
};

getAllPosts();
getLatestPosts();
