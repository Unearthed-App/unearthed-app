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

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface DailyEmailProps {
  title: string;
  author: string;
  subtitle?: string;
  imageUrl?: string;
  content: string;
  goodNews?: string;
  badNews?: string;
  premiumSection?: string;
  goodbyeSection?: string;
  note?: string;
  location: string;
  color?: string;
}

const colorLookup = {
  grey: {
    background: "#f5f5f5",
    border: "#000000",
    text: "#404040",
    accent: "#666666",
    shadow: "rgba(100,100,100,1)",
  },
  yellow: {
    background: "#fef9c3",
    border: "#eab308",
    text: "#713f12",
    accent: "#ca8a04",
    shadow: "rgba(234,179,8,1)",
  },
  blue: {
    background: "#dbeafe",
    border: "#3b82f6",
    text: "#1e3a8a",
    accent: "#2563eb",
    shadow: "rgba(59,130,246,1)",
  },
  pink: {
    background: "#fce7f3",
    border: "#ec4899",
    text: "#831843",
    accent: "#db2777",
    shadow: "rgba(236,72,153,1)",
  },
  orange: {
    background: "#ffedd5",
    border: "#f97316",
    text: "#7c2d12",
    accent: "#ea580c",
    shadow: "rgba(249,115,22,1)",
  },
  green: {
    background: "#dcfce7",
    border: "#16a34a",
    text: "#14532d",
    accent: "#15803d",
    shadow: "rgba(22,163,74,1)",
  },
  red: {
    background: "#fee2e2",
    border: "#dc2626",
    text: "#7f1d1d",
    accent: "#b91c1c",
    shadow: "rgba(220,38,38,1)",
  },
} as const;

type ColorKey = keyof typeof colorLookup;

export const FreeNoMoreEmail = ({
  title = "Changes to Unearthed",
  subtitle = "",
  content = `Hey!

I'm happy to announce that a lot of people are using Unearthed - thank you ☺️

While that's amazing, the problem is that the vast majority are doing so for free. This means I need to change something so that my personal costs don't continue to grow for the rest of my life 😅

The solution I've come up with is to offer something that runs locally on your computer, which means there's no hosting costs involved for me, and that means there will be no monthly costs for you.
Owning and keeping my own data is something that's important to me, so I prefer it this way anyway.
`,
  goodNews = `You get a free app (Unearthed Local) forever, no subscription required. The one condition is that you download it before the **1st of October**. If you try to get it after that it will ask you for a one time payment, which will also let you keep it forever after that. The benefit of paying for it will mean that you get updates for the entire version, for example, purchasing version v1.0.3 will give you updates up to v1.9.9.

Unearthed Local does not require a Browser extension or Obsidian Plugin. It is also completely private and does not see your Amazon credentials either.

Go here to get the app: https://unearthed.app/dashboard/free-no-more
You can read about it more by clicking the 'Read about it' button on that page too. I'll update the docs and videos soon.`,
  badNews = `I've decided to simplify Unearthed.app (Unearthed Online) and just offer the one tier which will not be free anymore, sorry! This means any free accounts will lose access after **1st of October**. So please download your data before then.`,
  premiumSection = `If you're a Premium user you can download the Unearthed Local app for free forever. Everything else will remain the same for you.`,
  goodbyeSection = `I didn't want to just kick people out without giving them an alternative.
I hope that you agree on the solution that I've come up with 🙂

Thanks for listening.`,
  note = "This is an important update about Unearthed's pricing model. Please take action before October 1st.",
  color = "orange",
  location = "Unearthed Update",
}: Partial<DailyEmailProps>) => {
  const previewText = `Important Changes to Unearthed - Free Local App Available`;

  if (!color || color == "") {
    color = "grey";
  }

  const matchingColor = Object.keys(colorLookup).find((key) =>
    color.toLowerCase().includes(key)
  ) as ColorKey | undefined;

  const colorScheme = colorLookup[matchingColor || "grey"];

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
              border: "2px solid #000000",
              borderRadius: "8px",
              margin: "16px auto",
              padding: "16px",
              maxWidth: "465px",
            }}
          >
            <Heading
              style={{
                color: "#000000",
                fontSize: "30px",
                fontWeight: "bold",
                textAlign: "center",
                padding: 0,
                margin: "8px 0 16px 0",
              }}
            >
              {title}
            </Heading>
            <Text
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {subtitle}
            </Text>

            <Section
              style={{
                backgroundColor: colorScheme.background,
                border: `2px solid ${colorScheme.border}`,
                borderRadius: "8px",
                padding: "32px 16px",
                position: "relative",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  borderLeft: `4px solid ${colorScheme.border}`,
                  paddingLeft: "16px",
                  height: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: "16px",
                    color: colorScheme.text,
                    lineHeight: "1.5",
                  }}
                >
                  {content}
                </Text>
              </div>
            </Section>

            {goodNews && (
              <Section
                style={{
                  backgroundColor: colorLookup.green.background,
                  border: `2px solid ${colorLookup.green.border}`,
                  borderRadius: "8px",
                  padding: "32px 16px",
                  position: "relative",
                  marginTop: "16px",
                }}
              >
                <div
                  style={{
                    borderLeft: `4px solid ${colorLookup.green.border}`,
                    paddingLeft: "16px",
                    height: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: colorLookup.green.text,
                      marginBottom: "12px",
                    }}
                  >
                    Good News 🎉
                  </Text>
                  <Text
                    style={{
                      fontSize: "16px",
                      color: colorLookup.green.text,
                      lineHeight: "1.5",
                    }}
                  >
                    {goodNews}
                  </Text>
                </div>
              </Section>
            )}

            {badNews && (
              <Section
                style={{
                  backgroundColor: colorLookup.red.background,
                  border: `2px solid ${colorLookup.red.border}`,
                  borderRadius: "8px",
                  padding: "32px 16px",
                  position: "relative",
                  marginTop: "16px",
                }}
              >
                <div
                  style={{
                    borderLeft: `4px solid ${colorLookup.red.border}`,
                    paddingLeft: "16px",
                    height: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: colorLookup.red.text,
                      marginBottom: "12px",
                    }}
                  >
                    Bad News 😔
                  </Text>
                  <Text
                    style={{
                      fontSize: "16px",
                      color: colorLookup.red.text,
                      lineHeight: "1.5",
                    }}
                  >
                    {badNews}
                  </Text>
                </div>
              </Section>
            )}

            {premiumSection && (
              <Section
                style={{
                  backgroundColor: colorLookup.pink.background,
                  border: `2px solid ${colorLookup.pink.border}`,
                  borderRadius: "8px",
                  padding: "32px 16px",
                  position: "relative",
                  marginTop: "16px",
                }}
              >
                <div
                  style={{
                    borderLeft: `4px solid ${colorLookup.pink.border}`,
                    paddingLeft: "16px",
                    height: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "16px",
                      color: colorLookup.pink.text,
                      lineHeight: "1.5",
                    }}
                  >
                    {premiumSection}
                  </Text>
                </div>
              </Section>
            )}

            {goodbyeSection && (
              <Section
                style={{
                  backgroundColor: colorScheme.background,
                  border: `2px solid ${colorScheme.border}`,
                  borderRadius: "8px",
                  padding: "32px 16px",
                  position: "relative",
                  marginTop: "16px",
                }}
              >
                <div
                  style={{
                    borderLeft: `4px solid ${colorScheme.border}`,
                    paddingLeft: "16px",
                    height: "100%",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "16px",
                      color: colorScheme.text,
                      lineHeight: "1.5",
                    }}
                  >
                    {goodbyeSection}
                  </Text>
                </div>
              </Section>
            )}

            <Hr
              style={{
                border: "1px solid #eaeaea",
                margin: "26px 0",
              }}
            />

            <Text
              style={{
                color: "#666666",
                fontSize: "12px",
                lineHeight: "24px",
              }}
            >
              {note}
            </Text>

            <Section
              style={{
                textAlign: "center",
                margin: "32px 0",
              }}
            >
              <Link
                href="https://unearthed.app/dashboard/free-no-more"
                style={{
                  backgroundColor: "#f97316",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "bold",
                  display: "inline-block",
                  border: "2px solid #000",
                }}
              >
                Get The App
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

FreeNoMoreEmail.PreviewProps = {
  title: "Changes to Unearthed",
  subtitle: "",
  content: `Hey!

I'm happy to announce that a lot of people are using Unearthed - thank you ☺️

While that's amazing, the problem is that the vast majority are doing so for free. This means I need to change something so that my personal costs don't continue to grow for the rest of my life 😅

The solution I've come up with is to offer something that runs locally on your computer, which means there's no hosting costs involved for me, and that means there will be no monthly costs for you.
Owning and keeping my own data is something that's important to me, so I prefer it this way anyway.
`,
  goodNews: `You get a free app (Unearthed Local) forever, no subscription required. The one condition is that you download it before the **1st of October**. If you try to get it after that it will ask you for a one time payment, which will also let you keep it forever after that. The benefit of paying for it will mean that you get updates for the entire version, for example, purchasing version v1.0.3 will give you updates up to v1.9.9.

Unearthed Local does not require a Browser extension or Obsidian Plugin. It is also completely private and does not see your Amazon credentials either.

Go here to get the app: https://unearthed.app/dashboard/free-no-more
You can read about it more by clicking the 'Read about it' button on that page too. I'll update the docs and videos soon.`,
  badNews: `I've decided to simplify Unearthed.app (Unearthed Online) and just offer the one tier which will not be free anymore, sorry! This means any free accounts will lose access after **1st of October**. So please download your data before then.`,
  premiumSection: `If you're a Premium user you can download the Unearthed Local app for free forever. Everything else will remain the same for you.`,
  goodbyeSection: `I didn't want to just kick people out without giving them an alternative.
I hope that you agree on the solution that I've come up with 🙂

Thanks for listening.`,
  note: "This is an important update about Unearthed's pricing model. Please take action before October 1st.",
  location: "Unearthed Update",
  color: "orange",
} as DailyEmailProps;

export default FreeNoMoreEmail;
