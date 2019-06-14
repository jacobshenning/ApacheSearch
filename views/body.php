<div class="bg-primary m-0" style="min-height: 1000px;">
  <div id="GoToSettings" style="cursor: pointer; position: absolute;" class="pl-4 pt-3 text-white"><i class="fa fa-2x fa-cog" aria-hidden="true"></i></div>
  <div id="GoToApp" style="cursor: pointer; position: absolute;" class="pl-4 pt-3 text-white"><i class="fa fa-2x fa-home" aria-hidden="true"></i></div>
  <div class="jumbotron bg-primary m-0">
    <div class="text-white text-center ">
      <h1 class="display-3">Apache Apps</h1>
      <p class="lead text-white">This list of all apache apps on this server</p>
    </div>
    <div class="container px-5 pt-5">
      <div id="apps">
        <div class="form-group">
          <input id="global_filter" class="form-control form-control-lg bg-primary" type="text" name="search" value="" placeholder="search...">
        </div>
        <table id="app_table" class="datatable table table-striped rounded bg-white">
          <thead>
            <tr>
              <th scope="col">Starred</th>
              <th scope="col">Name</th>
              <th scope="col">Category</th>
              <th scope="col">Link</th>
            </tr>
          </thead>
          <tbody>
            <?php
              $app_files = get_apps();

              foreach($app_files as $file) { ?>
                <tr>
                  <td>
                    <?php
                      $star = get_cookie($file . '_app_is_starred') === "" ? 'fa-star-o' : 'fa-star';
                    ?>
                    <i class="fa <?= $star ?> text-dark fa-2x" style="cursor:pointer;" aria-hidden="true"></i>
                  </td>
                  <td scope="row"><p class="file-name-class lead text-dark m-0 p-0"><?= $file ?></p></td>
                  <td>
                    <select class="category-class form-control form-control-sm" style="cursor:pointer;">
                      <?php
                        echo "<option value='Category'>Category</option>";
                        foreach (json_decode($_COOKIE['categories']) as $category => $id) {
                          $selected = get_cookie($file) === $id ? 'selected' : '';
                          echo "<option value='$id' $selected>$id</option>";
                        }
                      ?>
                    </select>
                  </td>
                  <td><a href="/<?= $file ?>" class="open-app-link lead m-0 p-0 text-primary" style="text-decoration: underline" target="_blank">Open</a></td>
                </tr>
              <?php } ?>
          </tbody>
        </table>
      </div>
      <div id="settings" class="text-white">
        <div class="form-group">
          <input id="add_category" class="form-control form-control-lg" type="text" name="search" value="" placeholder="New Category">
        </div>
        <table id="category_table" class="table table-striped rounded bg-white">
          <thead>
            <th class='category-name'>Categories</th>
            <th>Remove</th>
          </thead>
          <tbody>
            <?php
            if (isset($_COOKIE['categories'])) {
              foreach (json_decode($_COOKIE['categories']) as $category) { ?>
                <tr>
                  <td><?= $category ?></td>
                  <td><a href='#' class='remove-category'>Remove</a></td>
                </tr>
              <?php }
            }
            ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
