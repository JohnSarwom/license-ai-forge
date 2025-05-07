
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ComplianceItem {
  category: string;
  items: string[];
  reference?: string;
}

interface ComplianceTableProps {
  items: ComplianceItem[];
}

export function ComplianceTable({ items }: ComplianceTableProps) {
  // Group items by category
  const categories = Array.from(new Set(items.map(item => item.category)));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Compliance Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Capital Market Act - Categorization</TableCaption>
          <TableHeader>
            <TableRow>
              {categories.map((category) => (
                <TableHead key={category} className="font-semibold">
                  {category} 
                  {category === 'Additional Conditions' && <span className="ml-2 text-xs font-normal">(CM Act s.45)</span>}
                  {category === 'Exemptions' && <span className="ml-2 text-xs font-normal">(CM Act s.46?)</span>}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {categories.map((category) => (
                <TableCell key={category} className="align-top">
                  <ul className="list-disc pl-5 space-y-2">
                    {items
                      .filter(item => item.category === category)
                      .flatMap(item => item.items)
                      .map((item, index) => (
                        <li key={index} className="text-sm">{item}</li>
                      ))}
                  </ul>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
