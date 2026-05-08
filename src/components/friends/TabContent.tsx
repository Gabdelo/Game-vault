
interface TabContentProps {
  loading: boolean
  isEmpty: boolean
  emptyMessage: string
  data: any[]
  renderItem: (item: any) => React.ReactNode
}

export const TabContent: React.FC<TabContentProps> = ({
  loading,
  isEmpty,
  emptyMessage,
  data,
  renderItem,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-yellow-300  animate-bounce" />
          <div className="w-2 h-2 bg-yellow-300  animate-bounce delay-100" />
          <div className="w-2 h-2 bg-yellow-300  animate-bounce delay-200" />
        </div>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="text-center py-12 text-gray-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(item => renderItem(item))}
    </div>
  )
}
