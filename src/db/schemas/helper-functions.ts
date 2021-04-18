import Realm from "./realm";
import { 
    CurrentLoggedInUserSchema
 } from "./realm-schema";
import { LoggedIn_Session } from "./entities";

export function getCurrentLoggedInUserForToday(dayString: string) {
  return Realm.objects<LoggedIn_Session>(CurrentLoggedInUserSchema.name).filtered('dateTime = $0', dayString);
}

