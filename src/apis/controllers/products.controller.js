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
      const { category_id, name, description, image, price, quantity } = req.body;
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
          (${category_id}, ${name}, ${slug}, ${
            description ?? ""
          }, ${image}, ${price ?? 0}, ${quantity ?? 0}, ${ProductStatus.INSTOCK})
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
    async (_, res, { errorResponse, successResponse, sql }) => {
      const products = await sql`
        SELECT id, category_id, name, slug, description, image, price, quantity, status
        FROM products
        WHERE deleted_at IS NULL
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
      const { category_id, name, description, image, price, quantity, status } = req.body;
      const { id } = req.params;

      // check if product with name existed
      const [existingProduct] = await sql`
        SELECT id FROM products WHERE id = ${id} AND deleted_at IS NULL
      `;

      if(!existingProduct){
        return errorResponse("Product does not exist", 404);
      }

      // check if product with name existed
      // const [existingName] = await sql`
      //   SELECT name, slug FROM products WHERE id = ${id}
      // `;

      // if (!existingName) {
      //   return errorResponse("Product does not exist", 400);
      // }

      const [existingCategory] = await sql`
        SELECT id FROM categories WHERE id = ${category_id}
      `;

      if (!existingCategory) {
        return errorResponse(`Category with id ${category_id} not found`, 404);
      }

      const [product] = await sql`
        UPDATE products
        SET category_id = ${category_id} , name = ${name}, description = ${
          description ?? ""
        }, image = ${image}, price = ${price}, quantity = ${quantity}, status = ${status}
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

      if (existingProduct.id == null) {
        return errorResponse(`Product with id ${id} not found`, 404);
      }

      if (existingProduct.deleted_at != null) {
        return errorResponse(`Product with id ${id} is deleted`, 404);
      }
      const [product] = await sql`
      UPDATE products
      SET deleted_at = NOW()
      WHERE id = ${id}
      RETURNING id, category_id, name, slug, description, image, price, quantity
      `;


      return successResponse(
        { product },
        "Product deleted successfully",
        200
      );
    }
  ),

  // SetDelete Product
  resStoreProduct: controllerWrapper(
    async (req, _, { errorResponse, successResponse, sql }) => {
      const { id } = req.params;

      const [existingProduct] = await sql`
        SELECT id deleted_at FROM products WHERE id = ${id}
      `;

      if (existingProduct.id == null) {
        return errorResponse(`Product with id ${id} not found`, 404);
      }

      if (existingProduct.deleted_at == null) {
        return errorResponse(`Product with id ${id} is not deleted`, 404);
      }

      const [product] = await sql`
      UPDATE products
      SET deleted_at = NULL
      WHERE id = ${id}
      RETURNING id, category_id, name, slug, description, image, price, quantity
      `;


      return successResponse(
        { product },
        "Restore Product successfully",
        200
      );
    }
  ),
};

export default productsController;
