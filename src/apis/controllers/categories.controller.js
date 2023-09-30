import { controllerWrapper } from "@/lib/controller.wrapper";
import { slugify } from "@/lib/utils/common";
import { CategoryStatus } from "@/lib/constants";

const categoriesController = {
  /**
   * @typedef {Object} CategoryData
   * @property {string} name - The name of the category.
   * @property {number} parentId - The ID of the parent category (if applicable).
   * @property {string} description - The description of the category.
   * @property {string} image - The image URL or path for the category.
   */

  createCategory: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      /** @type {CategoryData} */
      const { name, parentId, description, image } = req.body;
      let slug = slugify(name);
      let counter = 1;
      const categories = await sql`
        SELECT name, slug FROM categories
      `;

      const existedCategory = categories.find(
        (category) => category.name.toLowerCase() === name.toLowerCase()
      );

      if (existedCategory) {
        return errorResponse(
          `Category with name '${name}' already existed`,
          400
        );
      }

      while (categories.find((category) => category.slug === slug)) {
        slug = slugify(`${name}-${counter}`);
        counter++;
      }

      const [newCategory] = await sql`
        INSERT INTO categories
          (name, slug, parent_id, description, image, status)
        VALUES
          (${name}, ${slug}, ${parentId ?? null}, ${
            description ?? ""
          }, ${image}, ${CategoryStatus.ACTIVE})
        RETURNING id, name, slug
      `;

      return successResponse(
        { newCategory },
        "Create new category successfully",
        200
      );
    }
  ),

  getAllCategories: controllerWrapper(
    async (_, res, { errorResponse, successResponse, sql }) => {
      const categories = await sql`
        SELECT id, name, slug, parent_id, description, image
        FROM categories
      `;

      return successResponse(
        { categories },
        "Get all categories successfully",
        200
      );
    }
  ),

  // upload category
  updateCategory: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { name, parentId, description, image } = req.body;
      const { id } = req.params;

      // check if category with name existed
      const [existingName] = await sql`
        SELECT name, slug FROM categories WHERE id != ${id} AND name = ${name}
      `;

      if (existingName) {
        return errorResponse("Category name already existed", 400);
      }

      const [category] = await sql`
        UPDATE categories
        SET name = ${name}, parent_id = ${parentId ?? null}, description = ${
          description ?? ""
        }, image = ${image}
        WHERE id = ${id}
        RETURNING id, name, slug, parent_id, description, image
      `;

      if (!category) {
        return errorResponse(`Category with id ${id} not found`, 404);
      }

      return successResponse(
        { category },
        "Upload category image successfully",
        200
      );
    }
  ),

  // toggle category status (active/inactive)
  toggleCategoryStatus: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { id } = req.params;

      const [existingStatus] = await sql`
        SELECT status FROM categories WHERE id = ${id}
      `;

      if (!existingStatus) {
        return errorResponse(`Category with id ${id} not found`, 404);
      }

      const [category] = await sql`
        UPDATE categories
        SET status = ${
          existingStatus.status === CategoryStatus.ACTIVE
            ? CategoryStatus.INACTIVE
            : CategoryStatus.ACTIVE
        }
        WHERE id = ${id}
        RETURNING id, name, slug, parent_id, description, image, status
      `;

      return successResponse(
        { category },
        "Toggle category status successfully",
        200
      );
    }
  ),
};

export default categoriesController;
