import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Navigation, NavigationSchema } from "./navigation.schema";
import {
  NavigationItem,
  NavigationItemSchema,
} from "./navigation-item.schema";
import { NavigationController } from "./navigation.controller";
import { NavigationService } from "./navigation.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Navigation.name, schema: NavigationSchema },
      { name: NavigationItem.name, schema: NavigationItemSchema },
    ]),
  ],
  providers: [NavigationService],
  controllers: [NavigationController],
  exports: [NavigationService],
})
export class NavigationModule {}
