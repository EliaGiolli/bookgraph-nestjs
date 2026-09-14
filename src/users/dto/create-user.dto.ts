import { User } from "../entities/user.entity.js";

// This exports only the types needed to save a new user
// Pick is a utility type that creates a new type by only selecting some properties from an existing type
export class CreateUserDto {
    name!: string;
    lastName!: string;
    username!: string;
    hashedPassword!: string;
}
