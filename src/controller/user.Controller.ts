import { Request, Response } from "express";
import { getUserServices } from "../services/user.Services";
export const getUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const user = await getUserServices(Number(id));
  console.log(user);
  res.status(200).json({success:true,data:user,message:"user fetched successfully" });
};


