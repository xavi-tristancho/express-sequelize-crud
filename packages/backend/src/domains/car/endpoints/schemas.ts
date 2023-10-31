import { z } from "zod";

export const upsertBodySchema = z.object({
  hotelId: z.number().optional(),
  status: z.enum(["active", "disabled", "removed"]),
  confirmationType: z.enum(["automatic", "manual"]),
  chainId: z.number(),
  code: z.string(),
  private: z.number().optional(),
  quantity: z.number().optional(),
  capacity: z.number().optional(),
  physical_room_type_texts: z
    .array(
      z.object({
        id: z.number().optional(),
        physicalRoomTypeId: z.number().optional(),
        type: z.string(),
        lang: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  UpsellOptionsFrom: z
    .array(
      z.object({
        id: z.number().optional(),
        fromPhysicalRoomTypeId: z.number().optional(),
        toPhysicalRoomTypeId: z.number(),
        price: z.number(),
        priceType: z.enum(["Night", "Week", "Entire Stay"]),
      })
    )
    .optional(),
  amenities: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string().optional(),
        icon: z.string().optional(),
      })
    )
    .optional(),
  roomFeatures: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string().optional(),
        icon: z.string().optional(),
      })
    )
    .optional(),
  PhysicalRoomGalleries: z.array(
    z.object({
      path: z.string(),
    })
  ),
});
