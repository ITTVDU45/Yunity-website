/**
 * Re-Export der Schema-Bausteine ueber die tiefen Pfade von @nestjs/mongoose.
 *
 * Der Paket-Einstieg (`@nestjs/mongoose`) zieht ueber die Modul-Datei den
 * gesamten Nest-Kern nach — inklusive der optionalen Pakete @nestjs/microservices
 * und @nestjs/websockets, die ein Next-Build nicht aufloesen kann. Die drei hier
 * verwendeten Bausteine haengen dagegen nur an mongoose und paketinternen
 * Speichern; ueber die direkten Pfade bleibt die Admin-App damit Nest-frei.
 *
 * In der NestJS-API sind es dieselben Funktionen — der Umweg schadet dort nicht.
 *
 * Der reflect-metadata-Polyfill wird hier importiert und nicht in einzelnen
 * Dateien: die @Prop-Dekoratoren lesen `design:type` ueber Reflect, und dieser
 * Shim ist die einzige Stelle, die garantiert vor jedem Schema geladen wird.
 */
import "reflect-metadata"

export { Prop } from "@nestjs/mongoose/dist/decorators/prop.decorator";
export { Schema } from "@nestjs/mongoose/dist/decorators/schema.decorator";
export { SchemaFactory } from "@nestjs/mongoose/dist/factories/schema.factory";
