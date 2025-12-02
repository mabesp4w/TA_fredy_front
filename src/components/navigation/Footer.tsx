/** @format */
"use client";
import React from "react";
import Link from "next/link";
import {
  Bird,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Globe,
  Heart,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth/authStore";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const Footer: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  const footerSections: FooterSection[] = [
    {
      title: "Tautan Cepat",
      links: [
        {
          label: "Jelajahi Keluarga",
          href: isAuthenticated ? "/admin/families" : "/families",
        },
        {
          label: "Jelajahi Burung",
          href: isAuthenticated ? "/admin/birds" : "/birds",
        },
        {
          label: "Galeri Gambar",
          href: isAuthenticated ? "/admin/images" : "/images",
        },
        {
          label: "Pustaka Suara",
          href: isAuthenticated ? "/admin/sounds" : "/sounds",
        },
        {
          label: "Pencarian Lanjutan",
          href: isAuthenticated ? "/admin/search" : "/search",
        },
      ],
    },
    {
      title: "Alat",
      links: [
        {
          label: "Gambar",
          href: isAuthenticated
            ? "/admin/images?action=upload"
            : "/images?action=upload",
        },
        {
          label: "Suara",
          href: isAuthenticated
            ? "/admin/sounds?action=upload"
            : "/sounds?action=upload",
        },
        // { label: "Operasi Massal", href: "/bulk" },
        // { label: "Ekspor Data", href: "/export" },
        // { label: "Dokumentasi API", href: "/docs/api" },
      ],
    },

    {
      title: "Dukungan",
      links: [
        {
          label: "Pusat Bantuan",
          href: isAuthenticated ? "/admin/help" : "/help",
        },
        {
          label: "Hubungi Kami",
          href: isAuthenticated ? "/admin/contact" : "/contact",
        },
        {
          label: "Laporkan Masalah",
          href: isAuthenticated ? "/admin/issues" : "/issues",
        },
        {
          label: "Permintaan Fitur",
          href: isAuthenticated ? "/admin/features" : "/features",
        },
        {
          label: "Komunitas",
          href: isAuthenticated ? "/admin/community" : "/community",
        },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/wwf", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com/wwf", label: "Twitter" },
    { icon: Globe, href: "https://wwf.org", label: "Website" },
  ];

  return (
    <footer className="bg-base-200 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Bird className="w-8 h-8 text-primary" />
              <div>
                <div className="text-xl font-bold text-base-content">BurungDB</div>
                <div className="text-sm text-base-content/70">Sistem Database</div>
              </div>
            </Link>

            <p className="text-sm text-base-content/70 mb-4">
              {/* terjemahkan ke bahasa indonesia */}
              Database spesies burung yang komprehensif dengan gambar, suara,
              dan data ilmiah untuk peneliti, ornitologis, dan penggemar alam.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-base-content/70">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>contact@birddb.org</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Pusat Penelitian Satwa Liar</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 className="font-semibold text-base-content mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-base-content/70 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-1 text-sm text-base-content/70">
              <span>© 2024 WWF. Dibuat dengan</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>Fredy Ramandey</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-base-content/70 hover:text-primary transition-colors"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-base-content/70 hover:text-primary transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/terms"
                className="text-base-content/70 hover:text-primary transition-colors"
              >
                Syarat Layanan
              </Link>
              <Link
                href="/cookies"
                className="text-base-content/70 hover:text-primary transition-colors"
              >
                Kebijakan Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
