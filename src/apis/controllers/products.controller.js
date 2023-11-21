import { controllerWrapper } from "@/lib/controller.wrapper";
import { slugify } from "@/lib/utils/common";
import { ProductStatus } from "@/lib/constants";

const productsController = {
  /**
   * @typedef {Object} ProductData
   * @property {string} name - The name of the category.
   * @property {number} parentId - The ID of the parent category (if applicable).
   * @property {string} description - The description of the category.
   * @property {string} image - The image URL or path for the category.
   */

  createProduct: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      /** @type {ProductData} */
      const { categoryId, name, description, image, price, quantity, status } =
        req.body;
      let slug = slugify(name);
      let counter = 1;
      const products = await sql`
        SELECT name, slug FROM products
      `;

      const existedProduct = products.find(
        (product) => product.name.toLowerCase() === name.toLowerCase()
      );

      if (existedProduct) {
        return errorResponse(
          `Product with name '${name}' already existed`,
          400
        );
      }

      while (products.find((product) => product.slug === slug)) {
        slug = slugify(`${name}-${counter}`);
        counter++;
      }

      const [newProduct] = await sql`
        INSERT INTO products
          (category_id, name, slug, description, image, price, quantity, status)
        VALUES
          (${categoryId}, ${name}, ${slug}, ${description ?? ""}, ${image}, ${
            price ?? 0
          }, ${quantity ?? 0}, ${status ?? ProductStatus.IN_STOCK})
        RETURNING id, name, slug
      `;

      return successResponse(
        { newProduct },
        "Create new product successfully",
        200
      );
    }
  ),

  getAllProducts: controllerWrapper(
    async (req, _, { successResponse, sql }) => {
      const { filter } = req.query;

      const products = await sql`
      SELECT
        p.id,
        category_id,
        p.name,
        p.slug,
        p.description,
        p.image,
        p.price,
        p.quantity,
        p.status,
        p.deleted_at,
        c.name AS category_name,
        pd.author,
        pd.publisher,
        pd.publication_date,
        pd.pages,
        e.enum_name AS status_name
      FROM
        products p
      LEFT JOIN product_details pd ON p.id = pd.id
      LEFT JOIN categories c ON
        p.category_id = c.id
      LEFT JOIN enums e ON p.status = e.id
        ${
          filter
            ? filter === "active"
              ? sql`WHERE p.deleted_at IS NULL`
              : filter === "inactive"
              ? sql`WHERE p.deleted_at IS NOT NULL`
              : sql``
            : sql``
        }
      ORDER BY p.created_at
    `;

      return successResponse(
        { products },
        "Get all products successfully",
        200
      );
    }
  ),

  // upload product
  updateProduct: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { categoryId, name, description, image, price, quantity, status } =
        req.body;
      const { id } = req.params;

      // check if product with name existed
      const [existingProduct] = await sql`
        SELECT id, deleted_at, status FROM products WHERE id = ${id} AND deleted_at IS NULL
      `;

      if (!existingProduct) {
        return errorResponse("Product does not exist", 404);
      }

      if (existingProduct.deletedAt !== null) {
        return errorResponse("Product is inactive", 400);
      }

      const [existingCategory] = await sql`
        SELECT id, deleted_at FROM categories WHERE id = ${categoryId}
      `;

      if (!existingCategory) {
        return errorResponse(`Category with id ${categoryId} not found`, 404);
      }

      if (existingCategory.deletedAt !== null) {
        return errorResponse(`Category with id ${categoryId} is inactive`, 400);
      }

      const [product] = await sql`
        UPDATE products
        SET category_id = ${categoryId} , name = ${name}, description = ${
          description ?? ""
        }, image = ${image}, price = ${price}, quantity = ${quantity}, status = ${
          status ?? existingProduct.status // if status is not provided, use the existing status
        }
        WHERE id = ${id}
        RETURNING id, category_id, name, slug, description, image, price, quantity, status
      `;

      if (!product) {
        return errorResponse(`Product with id ${id} not found`, 404);
      }

      return successResponse(
        { product },
        "Upload product image successfully",
        200
      );
    }
  ),

  // SetDelete Product
  deleteProduct: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { id } = req.params;

      const [existingProduct] = await sql`
        SELECT id, deleted_at FROM products WHERE id = ${id}
      `;

      if (!existingProduct) {
        return errorResponse(`Product with id ${id} not found`, 404);
      }

      if (existingProduct.deletedAt !== null) {
        return errorResponse(`Product with id ${id} is deleted`, 400);
      }
      const [product] = await sql`
      UPDATE products
      SET deleted_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, deleted_at
      `;

      return successResponse({ product }, "Product deleted successfully", 200);
    }
  ),

  // SetDelete Product
  restoreProduct: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { id } = req.params;

      const [existingProduct] = await sql`
        SELECT id, deleted_at FROM products WHERE id = ${id}
      `;

      if (!existingProduct) {
        return errorResponse(`Product with id ${id} not found`, 404);
      }

      if (existingProduct.deletedAt === null) {
        return errorResponse(`Product with id ${id} is not deleted`, 400);
      }

      const [product] = await sql`
      UPDATE products
      SET deleted_at = NULL
      WHERE id = ${id}
      RETURNING id, name, deleted_at
      `;

      return successResponse({ product }, "Restore Product successfully", 200);
    }
  ),
};

export default productsController;
