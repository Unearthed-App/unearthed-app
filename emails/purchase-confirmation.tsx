/**
 * Copyright (C) 2025 Unearthed App
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

export interface PurchaseConfirmationProps {
  productName: string;
  purchaseId: string;
  downloadUrl: string;
}

export default function PurchaseConfirmation({
  productName,
  purchaseId,
  downloadUrl,
}: PurchaseConfirmationProps) {
  const previewText = `Your Unearthed Local purchase is confirmed`;
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
            <Text style={{ fontSize: 16 }}>
              <strong>Purchase ID:</strong> {purchaseId}
            </Text>
            <Text style={{ fontSize: 16 }}>
              Please save this ID in a safe place. You will need it to download
              new or old versions.
            </Text>
            <Text style={{ fontSize: 16 }}>
              To access downloads, visit:{" "}
              <Link href={downloadUrl}>{downloadUrl}</Link> and enter your
              Purchase ID.
            </Text>
            <Section style={{ textAlign: "center", marginTop: 16 }}>
              <Text style={{ fontSize: 14, lineHeight: 1.6 }}>
                This is a <strong>one-time payment</strong> for this version of
                Unearthed Local. You can download updates from{" "}
                <code>1.0.0</code> up to <code>1.9.9</code> by returning to{" "}
                <Link href="https://unearthed.app/local-download">
                  unearthed.app/local-download
                </Link>{" "}
                and entering your Purchase ID.
              </Text>
            </Section>
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
