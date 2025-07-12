import { AppDataSource } from "../data-source";
import { User } from "../models/user";

const UserRepository = AppDataSource.getRepository(User);

export default UserRepository;
