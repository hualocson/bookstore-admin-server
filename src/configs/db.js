import postgres from "postgres";
import configs from "@/configs/vars";

const sql = postgres(configs.dbUrl);

export default sql;
