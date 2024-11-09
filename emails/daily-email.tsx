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
} as const;

type ColorKey = keyof typeof colorLookup;

export const DailyEmail = ({
  title,
  author,
  subtitle,
  content,
  note,
  color = "blue",
  location,
}: DailyEmailProps) => {
  const previewText = `Unearthed Daily Reflection`;

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

            <Text
              style={{
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              by {author}
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
            <Section
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  backgroundColor: `#000`,
                  border: `2px solid #fff`,
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  borderRadius: "8px",
                  marginTop: "6px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <Text
                  style={{
                    fontSize: "12px",
                    color: "#fff",
                  }}
                >
                  {location}
                </Text>
              </div>
            </Section>

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
              <Link href="https://unearthed.app">
                Get a new Daily Reflection
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

DailyEmail.PreviewProps = {
  title: "Book Title",
  author: "John Smith",
  subtitle: "Book subtitle goes here",
  imageUrl: "",
  content:
    "Cupidatat magna aute non enim sint occaecat labore esse ut adipisicing est aliqua. Eiusmod ipsum culpa consectetur est deserunt laboris excepteur quis voluptate enim quis.",
  note: "Cupidatat nisi id ad mollit irure laborum laborum nulla culpa laborum labore.",
  location: "Page 123",
  color: "blue",
} as DailyEmailProps;

export default DailyEmail;
