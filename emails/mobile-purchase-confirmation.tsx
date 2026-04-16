/**
 * Copyright (C) 2026 Unearthed App
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
import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Link,
  Tailwind,
  Section,
} from "@react-email/components";

export interface MobilePurchaseConfirmationProps {
  productName: string;
  purchaseId: string;
}

export default function MobilePurchaseConfirmation({
  productName,
  purchaseId,
}: MobilePurchaseConfirmationProps) {
  const previewText = `Your Unearthed Mobile purchase is confirmed`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body
          style={{
            backgroundColor: "hsl(10, 100%, 93%)",
            margin: "auto",
            fontFamily: "system-ui, -apple-system, sans-serif",
            padding: "8px",
          }}
        >
          <Container
            style={{
              backgroundColor: "hsl(337, 68%, 97%)",
              border: "2px solid #000",
              borderRadius: 8,
              margin: "16px auto",
              padding: 16,
              maxWidth: 520,
            }}
          >
            <Heading
              style={{
                color: "#000",
                fontSize: 28,
                fontWeight: 800,
                textAlign: "center",
                margin: "8px 0 16px",
              }}
            >
              Purchase Confirmed
            </Heading>
            <Text style={{ fontSize: 16 }}>Hi,</Text>
            <Text style={{ fontSize: 16 }}>
              Thank you for your purchase of <strong>{productName}</strong>.
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Your Purchase ID:
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 800,
                fontFamily: "monospace",
                backgroundColor: "#f0f0f0",
                border: "2px solid #000",
                borderRadius: 4,
                padding: "8px 12px",
                letterSpacing: "0.05em",
              }}
            >
              {purchaseId}
            </Text>
            <Text style={{ fontSize: 16 }}>
              Save this ID somewhere safe — you&apos;ll need it to unlock
              Unearthed Mobile on your devices.
            </Text>
            <Text style={{ fontSize: 16 }}>
              To get started, open{" "}
              <Link href="https://mobile.unearthed.app">
                mobile.unearthed.app
              </Link>{" "}
              on your phone or tablet and enter your Purchase ID when prompted.
            </Text>
            <Section style={{ textAlign: "center", marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#555",
                  borderLeft: "3px solid #ccc",
                  paddingLeft: 12,
                  textAlign: "left",
                }}
              >
                <strong>Fair Use:</strong> Your Purchase ID works on all your
                personal devices — phone, tablet, multiple browsers. We
                don&apos;t limit device count. However, Purchase IDs are for
                personal use only. Sharing your Purchase ID publicly or with
                others may result in it being deactivated.
              </Text>
            </Section>
            <Text style={{ fontSize: 16 }}>
              Lost your Purchase ID? Visit{" "}
              <Link href="https://unearthed.app/mobile-download">
                unearthed.app/mobile-download
              </Link>{" "}
              to look it up.
            </Text>
            <Text style={{ fontSize: 16 }}>
              If you have any questions, just reply to this email.
            </Text>
            <Text style={{ fontSize: 16 }}>— Unearthed</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
