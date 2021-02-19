angular.module("app", []);

function downloadObjectAsJson(data, filename) {
  const json = JSON.stringify(data);

  var dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(json)}`;
  var htmlAnchor = document.createElement("a");
  htmlAnchor.setAttribute("href", dataStr);
  htmlAnchor.setAttribute("download", filename);
  document.body.appendChild(htmlAnchor);
  htmlAnchor.click();
  htmlAnchor.remove();
}

angular.module("app").controller("BodyController", function ($scope) {
  $scope.editMode = false;

  function importFileChanged(e) {
    $scope.$apply(function () {
      $scope.importFileChanged(e);
    });
  }

  function applyImages(bookmarks) {
    for (const bookmark of bookmarks.columns) {
      for (const item of bookmark.items) {
        const image = localStorage.getItem(`img-${item.id}`);
        if (image) {
          item.image = image;
        } else {
          delete item.image;
        }
      }
    }
  }

  function onLoad() {
    const importFile = document.getElementById("importFile");
    importFile.addEventListener("change", importFileChanged);

    const bookmarksData = localStorage.getItem("bookmarks");

    if (!bookmarksData) {
      $scope.bookmarks = { columns: [] };
      $scope.editMode = true;
      return;
    }

    try {
      const bookmarks = JSON.parse(bookmarksData);

      applyImages(bookmarks);

      $scope.bookmarks = bookmarks;
    } catch (e) {
      console.warn("invalid data");
      $scope.bookmarks = { columns: [] };
      $scope.editMode = true;
    }
  }

  $scope.toggleEditMode = function () {
    $scope.editMode = !$scope.editMode;
  };

  $scope.export = function () {
    const bookmarks = JSON.parse(JSON.stringify($scope.bookmarks));
    const images = {};

    for (const bookmark of bookmarks.columns) {
      delete bookmark.$$hashKey;

      for (const item of bookmark.items) {
        if (item.image) {
          images[item.id] = item.image;
        }

        delete item.$$hashKey;
        delete item.image;
      }
    }

    const exportedData = {
      bookmarks: bookmarks,
      images: images,
      metaData: {
        exportedOn: new Date().toISOString(),
      },
    };

    downloadObjectAsJson(exportedData, "bookmark-data.json");
  };

  $scope.import = function () {
    const importFile = document.getElementById("importFile");
    importFile.click();
  };

  $scope.importFileChanged = function (evt) {
    console.log("input file changed", evt);

    const file = evt.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (_) => {
      const data = fileReader.result;

      try {
        const json = JSON.parse(data);

        const bookmarks = { columns: [] };

        if (!json || !json.bookmarks || !json.bookmarks.columns) {
          throw new Error("no bookmarks in file");
        }

        for (const importedColumn of json.bookmarks.columns) {
          if (!importedColumn.id) {
            continue;
          }

          const column = {
            id: importedColumn.id,
            header: importedColumn.header,
            items: [],
          };

          for (const importedItem of importedColumn.items) {
            if (!importedItem.id || !importedItem.href) {
              continue;
            }

            const item = {
              id: importedItem.id,
              title: importedItem.title,
              href: importedItem.href,
            };

            column.items.push(item);
          }

          bookmarks.columns.push(column);
        }

        $scope.bookmarks = bookmarks;
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

        if (json.images) {
          for (const imageKey in json.images) {
            const imageData = json.images[imageKey];
            if (
              typeof imageData !== "string" ||
              !imageData.startsWith("data:image/")
            ) {
              console.warn(`invalid image ${imageKey}`);
              continue;
            }

            localStorage.setItem(`img-${imageKey}`, imageData);
          }
        }

        applyImages(bookmarks);

        $scope.editMode = false;
        $scope.$apply();
      } catch (e) {
        console.log("error importing", e);
      }
    };

    fileReader.readAsText(file);
  };

  onLoad();
});
