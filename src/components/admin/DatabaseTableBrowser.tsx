import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Database, Table, Search, Eye, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TableInfo {
  schema: string;
  name: string;
  rowCount?: number;
  columns?: ColumnInfo[];
}

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  default: string | null;
}

const DatabaseTableBrowser = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const knownTables = [
    'profiles', 'user_roles', 'students', 'courses', 'announcements',
    'documents', 'student_applications', 'fee_payments', 'alumni_profiles',
    'agent_profiles', 'academic_calendar', 'emails', 'chat_messages'
  ];

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    const tableList: TableInfo[] = knownTables.map(name => ({
      schema: 'public',
      name,
      rowCount: 0
    }));
    setTables(tableList);
  };

  const loadTableData = async (tableName: string) => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from(tableName as any)
        .select('*', { count: 'exact' })
        .limit(50);

      if (error) throw error;

      setTableData(data || []);
      
      if (data && data.length > 0) {
        const cols: ColumnInfo[] = Object.keys(data[0]).map(key => ({
          name: key,
          type: typeof data[0][key],
          nullable: true,
          default: null
        }));
        setColumns(cols);
      }

      toast({
        title: "Success",
        description: `Loaded ${data?.length || 0} rows from ${tableName}`
      });
    } catch (error) {
      console.error('Error loading table:', error);
      toast({
        title: "Error",
        description: "Failed to load table data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setTableData([]);
    setColumns([]);
    loadTableData(tableName);
  };

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatValue = (value: any): string => {
    if (value === null) return 'NULL';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Database Table Browser</CardTitle>
              <CardDescription>Browse and inspect database tables and records</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedTable} onValueChange={handleTableSelect}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {filteredTables.map(table => (
                  <SelectItem key={table.name} value={table.name}>
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      {table.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTable && (
              <Button
                variant="outline"
                onClick={() => loadTableData(selectedTable)}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>

          {!selectedTable && (
            <div className="text-center py-12 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a table to view its contents</p>
            </div>
          )}

          {selectedTable && tableData.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              <Table className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No data found in {selectedTable}</p>
            </div>
          )}

          {selectedTable && tableData.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Table className="h-5 w-5" />
                      {selectedTable}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Showing {tableData.length} records
                    </CardDescription>
                  </div>
                  <Badge>{columns.length} columns</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full">
                  <UITable>
                    <TableHeader>
                      <TableRow>
                        {columns.map(col => (
                          <TableHead key={col.name} className="font-mono">
                            <div className="space-y-1">
                              <div>{col.name}</div>
                              <Badge variant="outline" className="text-xs font-normal">
                                {col.type}
                              </Badge>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {columns.map(col => (
                            <TableCell key={col.name} className="font-mono text-xs">
                              {formatValue(row[col.name])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </UITable>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseTableBrowser;
