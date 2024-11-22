/**
 * Copyright (C) 2024 Unearthed App
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

"use server";

import { schema } from "./formSchema";

import { auth } from "@clerk/nextjs/server";
const formData = require("form-data");
const Mailgun = require("mailgun.js");
import PostHogClient from "@/app/posthog";

export async function onSubmitAction(data: any) {
  const posthogClient = PostHogClient();

  const { userId } = await auth();

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data",
    };
  }

  const toSend = {
    fromName: parsed.data.name,
    from: parsed.data.email,
    to: process.env.MAILGUN_RECIPIENT!,
    subject: "Unearthed Contact Form",
    message: parsed.data.message,
    htmlMessage: parsed.data.message.replace(/\n/g, "<br>"),
  };

  posthogClient.capture({
    distinctId: `contact email ${userId ? userId : toSend.from}`,
    event: `contact email`,
    properties: toSend,
  });

  return mg.messages
    .create(process.env.MAILGUN_DOMAIN!, {
      from: `${toSend.fromName} <${toSend.from}>`,
      to: [toSend.to],
      subject: toSend.subject,
      text: toSend.message,
      html: toSend.htmlMessage,
    })
    .then((msg: any) => {
      return {
        success: true,
        message: "Sent successfully.",
      };
    })
    .catch((err: any) => {
      return {
        success: false,
        message: "Could not send.",
      };
    });
}
