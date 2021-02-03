import { Query, Resolver } from "type-graphql";

@Resolver()
export class HealthResolver {
      @Query(() => String)
      Health() {
            return "Bingo! Server is up and running."
      }
}