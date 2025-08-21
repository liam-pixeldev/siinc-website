import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const leftQuestions = [
  {
    question: 'What is Siinc and how does it work with ACC?',
    answer:
      'Siinc is a purpose-built backup and recovery solution for Autodesk Construction Cloud. It connects directly via OAuth, continuously backs up your BIM360 and BIM Collaborate projects, and stores them in your preferred cloud or on-premises location.',
  },
  {
    question: 'How quickly can I restore lost data?',
    answer:
      'Recovery is nearly instant. You can restore individual files in seconds, folders in minutes, or entire projects within an hour, depending on size. Our granular restore capability means you only recover what you need.',
  },
  {
    question: 'What storage options are available?',
    answer:
      'Siinc supports Azure, AWS, any S3-compatible storage, and on-premises solutions. You maintain complete control over where your data is stored, ensuring compliance with your data sovereignty requirements.',
  },
  {
    question: 'How does Siinc help with compliance?',
    answer:
      'Siinc provides immutable audit logs, automated compliance reports, and full metadata preservation that satisfy ISO standards, cyber insurance requirements, and regulatory audits. Reports are generated on-demand.',
  },
  {
    question: 'What happens during an Autodesk outage?',
    answer:
      'Your backed-up data remains fully accessible through Siinc. You can browse, download, and share project files ensuring business continuity even when ACC is unavailable.',
  },
];

const rightQuestions = [
  {
    question: 'How long does setup take?',
    answer:
      "Setup takes less than 30 minutes. Simply authorize Siinc through OAuth, select your projects to backup, choose your storage destination, and you're protected. No agents or complex configurations required.",
  },
  {
    question: 'Is my data encrypted and secure?',
    answer:
      'Yes, all data is encrypted both in transit and at rest using industry-standard AES-256 encryption. Access is controlled through your existing ACC permissions, and all activities are logged for audit purposes.',
  },
  {
    question: 'What if my contractor goes bankrupt?',
    answer:
      'Siinc ensures you retain complete copies of all project data independent of contractor access. If a contractor loses ACC access or goes bankrupt, your backed-up data remains fully accessible to you.',
  },
  {
    question: 'Can I try Siinc before committing?',
    answer:
      'Yes, we offer a 30-day free trial with full functionality. No credit card required. You can also use our instant quote calculator at siinc.io/calculator to understand pricing for your specific needs.',
  },
];

export const FAQ = () => {
  return (
    <section className={'pb-16 md:pb-28 lg:pb-32'}>
      <div className="container mx-auto lg:max-w-5xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight lg:text-3xl">
          Frequently Asked Questions
        </h2>

        <div className="mt-6 grid gap-x-12 md:mt-10 md:grid-cols-2 lg:mt-14">
          <Accordion
            type="single"
            collapsible
            className="text-muted-foreground border-t"
          >
            {leftQuestions.map((item, i) => (
              <AccordionItem key={i} value={`left-${i}`}>
                <AccordionTrigger className="hover:text-accent data-[state=open]:text-accent">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Accordion
            collapsible
            type="single"
            className="text-muted-foreground md:border-t"
          >
            {rightQuestions.map((item, i) => (
              <AccordionItem key={i} value={`right-${i}`}>
                <AccordionTrigger className="hover:text-accent data-[state=open]:text-accent">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
