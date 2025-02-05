import type React from "react";
import type {ContactMethodType} from "@prisma/client";
import HouseSvg from "~/public/svgs/contact/house.svg";
import EnvelopeSvg from "~/public/svgs/contact/envelope.svg";
import PhoneSvg from "~/public/svgs/contact/phone.svg";

type ContactMethodIconsKeys = {
  [key in ContactMethodType]: React.FC<React.SVGProps<SVGSVGElement>>;
};

const contactMethodIconsDef: ContactMethodIconsKeys = {
  NAME: HouseSvg,
  ADDRESS: HouseSvg,
  EMAIL: EnvelopeSvg,
  PHONE: PhoneSvg,
  ACCOUNT_NO: HouseSvg,
  IFSC: HouseSvg,
  GST: EnvelopeSvg
};

function getContactIcon(key: ContactMethodType) {
  return contactMethodIconsDef[key];
}

export {getContactIcon, contactMethodIconsDef};
