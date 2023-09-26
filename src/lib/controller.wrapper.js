import createResponseHandler from "./response.handler";
import sql from "@/configs/db";
import { validationResult } from "express-validator";
/**
 * @callback AsyncHandlerFunction
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Object} helpers
 * @param {import('@/lib/response.handler').ErrorResponse} helpers.errorResponse
 * @param {import('@/lib/response.handler').SuccessResponse} helpers.successResponse
 * @param {import('@/lib/response.handler').SuccessResponseWithEmptyBody} helpers.successResponseWithEmptyBody
 * @param {import('postgres').Sql} helpers.sql
 * @returns
 */

/**
 * @function controllerWrapper This function is used to wrap controller function to catch error
 * @param {AsyncHandlerFunction} callback
 * @returns {import('express').RequestHandler}
 */
export const controllerWrapper = (callback) => async (req, res, next) => {
  const { errorResponse, successResponse, successResponseWithEmptyBody } =
    createResponseHandler(res);

  const validation = validationResult(req);
  if (validation.errors.length > 0) {
    return errorResponse(`Validation error: ${validation.errors[0].msg}`, 422);
  }

  try {
    await callback(req, res, {
      errorResponse,
      successResponse,
      successResponseWithEmptyBody,
      sql,
    });
  } catch (error) {
    next(error);
  }
};
