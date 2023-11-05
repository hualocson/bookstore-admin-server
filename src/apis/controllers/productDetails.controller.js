import { controllerWrapper } from "@/lib/controller.wrapper";


const productDetailsController = {
    //create productDetails
    createProductDetails: controllerWrapper(
        async (req, _, {errorResponse, successResponse, sql }) => {
            const {id ,pages, author, publisher, publicationDate } = req.body;
            //Check if product id is exist
            const [product] = await sql`
            SELECT id FROM products WHERE id = ${id}
            `;
            if (!product) {
                return errorResponse(`Product with id ${id} not found`, 404);
            }
            //create new productDetails
            const [newProductDetails] = await sql`
            INSERT INTO product_details
            (id,pages, author, publisher, publication_date)
            VALUES
            (${id},${pages}, ${author}, ${publisher}, ${publicationDate})
            RETURNING id, pages, author, publisher, publication_date
            `;
            return successResponse(
                { newProductDetails },
                "Create new product details successfully",
                200
            );
        }
    ),

    // getAllProductDetails
    getAllProductDetails: controllerWrapper(
        async (req, _, { successResponse, sql }) => {
            const productDetails = await sql`
            SELECT
                pd.id,
                pd.pages,
                pd.author,
                pd.publisher,
                pd.publication_date,
                pd.created_at,
                pd.updated_at
            FROM
                product_details pd
            ORDER BY pd.created_at
            `;

            return successResponse(
                { productDetails },
                "Get all product details successfully",
                200
            );
        }
    ),

    // getProductDetailsById
    getProductDetailsById: controllerWrapper(
        async (req, _, { successResponse, sql }) => {
            const { id } = req.params;
            //Check if product id is exist
            const [product] = await sql`
            SELECT id FROM products WHERE id = ${id}
            `;
            if (!product) {
                return errorResponse(`Product with id ${id} not found`, 404);
            }
            const [productDetails] = await sql`
            SELECT
                pd.id,
                pd.pages,
                pd.author,
                pd.publisher,
                pd.publication_date,
                pd.created_at,
                pd.updated_at
            FROM
                product_details pd
            WHERE pd.id = ${id}
            `;

            return successResponse(
                { productDetails },
                "Get product details by id successfully",
                200
            );
        }
    ),
    
    //Update productDetails
    updateProductDetails: controllerWrapper(
        async (req, _, { errorResponse,successResponse, sql }) => {
            const { pages, author, publisher, publicationDate } = req.body;
            const { id } = req.params;
            //Check if product id is exist
            const [product] = await sql`
            SELECT id,deleted_at,status FROM products WHERE id = ${id}
            `;
            if (!product) {
                return errorResponse(`Product with id ${id} not found`, 404);
            }
            const [existingProductDetails] = await sql`SELECT id,pages,author FROM product_details WHERE id = ${id}
            `;
            if (!existingProductDetails) {
                return errorResponse(`Product details with product id ${id} not found`, 404);
            }
            const [productDetails] = await sql`
            UPDATE product_details
            SET
                pages = ${pages},
                author = ${author},
                publisher = ${publisher},
                publication_date = ${publicationDate}
            WHERE id = ${id}
            RETURNING id, pages, author, publisher, publication_date
            `;

            return successResponse(
                { productDetails },
                "Update product details successfully",
                200
            );
        }
    ),
    //delete productDetails
    deleteProductDetails: controllerWrapper(
        async (req, _, { successResponse, sql }) => {
            const { id } = req.params;
            //Check if product id is exist
            const [product] = await sql`
            SELECT id FROM products WHERE id = ${id}
            `;
            if (!product) {
                return errorResponse(`Product with id ${id} not found`, 404);
            }
            const [productDetails] = await sql`
            DELETE FROM product_details
            WHERE id = ${id}
            RETURNING id, pages, author, publisher, publication_date
            `;

            return successResponse(
                { productDetails },
                "Delete product details successfully",
                200
            );
        }
    )
}
export default productDetailsController;