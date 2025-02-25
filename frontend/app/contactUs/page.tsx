'use client';
import React from 'react';
import { TextInput, Textarea, Button, Paper, Title, Text, Container, Group } from '@mantine/core';
import { IconPhone, IconAt, IconMapPin } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function ContactUs() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    notifications.show({
      title: 'Message Sent',
      message: 'Thank you for contacting us. We will get back to you soon!',
      color: 'green',
    });
  };

  const contactInfo = [
    {
      icon: <IconPhone className="w-6 h-6" />,
      title: 'Phone',
      value: '+91 9876543210',
    },
    {
      icon: <IconAt className="w-6 h-6" />,
      title: 'Email',
      value: 'shopwithus@ecommerce.com',
    },
    {
      icon: <IconMapPin className="w-6 h-6" />,
      title: 'Address',
      value: '123 E-commerce Street, Digital City, 12345',
    },
  ];

  return (
    <Container size="lg" className="py-16">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <Title order={1} className="text-3xl font-bold mb-6">
            Get in Touch
          </Title>
          <Text className="text-gray-600 mb-8">
            Have questions about our products or services? We're here to help! Fill out the form
            and we'll get back to you as soon as possible.
          </Text>

          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Paper key={index} p="md" className="flex items-center space-x-4">
                <div className="text-green-500">{info.icon}</div>
                <div>
                  <Text size="sm" className="font-semibold">
                    {info.title}
                  </Text>
                  <Text className="text-gray-600">{info.value}</Text>
                </div>
              </Paper>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <Paper shadow="md" radius="lg" p="xl" className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="Name"
              placeholder="Your name"
              required
              classNames={{
                input: 'focus:border-blue-500',
              }}
            />
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              type="email"
              classNames={{
                input: 'focus:border-blue-500',
              }}
            />
            <TextInput
              label="Subject"
              placeholder="How can we help?"
              required
              classNames={{
                input: 'focus:border-blue-500',
              }}
            />
            <Textarea
              label="Message"
              placeholder="Please describe your inquiry..."
              required
              minRows={4}
              classNames={{
                input: 'focus:border-blue-500',
              }}
            />
            <Group justify="flex-end" mt="md">
              <Button type="submit" className="bg-[#fbbf24] hover:bg-[#b4923c]">
                Send Message
              </Button>
            </Group>
          </form>
        </Paper>
      </div>
    </Container>
  );
}

export default ContactUs;
