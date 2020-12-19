import { DbBaseInterface } from "utils/dbBaseInterface";
import { DbFirebase } from "utils/dbFirebase";
import { DbMongo } from "utils/dbMongo";

const useFirebase = true;

export const API: DbBaseInterface = useFirebase
  ? new DbFirebase()
  : new DbMongo();
