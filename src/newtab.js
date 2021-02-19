angular.module("app", []);

angular.module("app").controller("BodyController", function ($scope) {
  function onLoad() {
    const bookmarksData = localStorage.getItem("bookmarks");

    if (!bookmarksData) {
      $scope.bookmarks = { columns: [] };
      return;
    }

    const bookmarks = JSON.parse(bookmarksData);

    for (const bookmark of bookmarks.columns) {
      for (const item of bookmark.items) {
        const image = localStorage.getItem(`img-${item.id}`);
        if (image) {
          item.image = image;
        }
      }
    }

    $scope.bookmarks = bookmarks;
  }

  onLoad();
});
