import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';

const links = [
  { link: '#', label: 'Contact' },
  { link: '#', label: 'Privacy' },
  { link: '#', label: 'Blog' },
  { link: '#', label: 'Store' },
  { link: '#', label: 'Careers' },
];

function Footer() {
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className="text-[#D1FAE5] hover:text-[#10B981] transition-colors duration-200 text-sm"
      onClick={(event) => event.preventDefault()}
      
    >
      {link.label}
    </a>
  ));

  return (
    <footer className="bg-[#064E3B] text-[#D1FAE5]  border-t border-[#10B981] ">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            {items}
          </div>

          <div className="flex space-x-4">
            <button
              title="Twitter"
              className="p-2 rounded-full text-[#D1FAE5] hover:text-[#10B981] hover:bg-[#065F46] transition-colors duration-200"
            >
              <IconBrandTwitter size={20} stroke={1.5} />
            </button>
            <button
              title="YouTube"
              className="p-2 rounded-full text-[#D1FAE5] hover:text-[#10B981] hover:bg-[#065F46] transition-colors duration-200"
            >
              <IconBrandYoutube size={20} stroke={1.5} />
            </button>
            <button
              title="Instagram"
              className="p-2 rounded-full text-[#D1FAE5] hover:text-[#10B981] hover:bg-[#065F46] transition-colors duration-200"
            >
              <IconBrandInstagram size={20} stroke={1.5} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
